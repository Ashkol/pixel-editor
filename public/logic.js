const canvasSize = 16;
let chosenColor;
let prevColor;
paintQueue = []
setup();

function setup() {
    createPixelCanvas(canvasSize);
    createColorPalette(5);
    setCanvasListeners();
    setColorPaletteListeners();
    document.getElementById("buttonCancel").addEventListener('click', reversePaint);
    document.getElementById("buttonSave").addEventListener('click', createImage);
}



function createPixelCanvas(size) {
    let table = document.createElement('table');
    for (let i = 0; i < size; i++){
        let tr = document.createElement('tr');   
        for (let j = 0; j < size; j++)
        {
            td = document.createElement('td');
            td.style.backgroundColor = 'white';
            td.classList.add('pixel-cell');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    table.classList.add("pixel-canvas");
    table.setAttribute('id', 'pixelCanvas');
    document.getElementById("desktop").insertBefore(table, document.getElementById("canvasSide"));
    
}

function setCanvasListeners() {
    let pixelCanvas = document.getElementById("pixelCanvas");
        if (pixelCanvas != null) {
        for (let i = 0; i < pixelCanvas.rows.length; i++) {
            for (let j = 0; j < pixelCanvas.rows[i].cells.length; j++)
            {
                const cell = pixelCanvas.rows[i].cells[j];
               
                function enter () {
                    prevColor = cell.style.backgroundColor;
                    changeCellColor(chosenColor, cell);
                }
                function leave () {
                    changeCellColor(prevColor, cell);
                }
                function click () {
                    addToPaintQueue(prevColor, cell);
                    prevColor = cell.style.backgroundColor;
                }

                cell.addEventListener('mouseenter', enter);
                cell.addEventListener('mouseleave', leave);
                cell.addEventListener('click', click);
            }
        }
    }
}

function addToPaintQueue(prevColor, cell) {
    if (paintQueue.length > 100) {
        paintQueue.splice(0, 1)
    }
    paintQueue.push({prevColor, cell})
}

function reversePaint(){
    if (paintQueue.length > 0) {
        paintE = paintQueue.pop();
        changeCellColor(paintE.prevColor, paintE.cell);
    }
}

function setColorPaletteListeners() {
    const colorPalette = document.getElementById("colorPalette");
    if (colorPalette != null) {
        for (let i = 0; i < colorPalette.rows.length; i++) {
            for (let j = 0; j < colorPalette.rows[i].cells.length; j++)
            colorPalette.rows[i].cells[j].onclick = function () {
                setCurrentColor(this);
            };
        }
    }
}

function createColorPalette(columns) {
    colors = ['#000000', '#fcfcfc', '#f8f8f8', '#bcbcbc', '#7c7c7c', '#a4e4fc', '#3cbcfc', '#0078f8', '#0000fc', '#b8b8f8',
                '#6888fc', '#0058f8', '#0000bc', '#d8b8f8', '#9878f8', '#6844fc', '#4428bc', '#f8b8f8', '#f878f8', '#d800cc',
                '#940084', '#f8a4c0', '#f85898', '#e40058', '#a80020', '#f0d0b0', '#f87858', '#f83800', '#a81000', '#fce0a8',
                '#fca044', '#e45c10', '#881400', '#f8d878', '#f8b800', '#ac7c00', '#503000', '#d8f878', '#b8f818', '#00b800',
                '#007800', '#b8f8b8', '#58d854', '#00a800', '#006800', '#b8f8d8', '#58f898', '#00a844', '#005800', '#00fcfc',
                '#00e8d8', '#008888', '#004058', '#f8d8f8', '#787878'];
    
    table = document.createElement('table');
    let tr;
    for (let i = 0; i < colors.length; i++){
        if (i % columns == 0) {
            tr = document.createElement('tr');   
        } 
        td = document.createElement('td');
        td.style.background = colors[i];
        td.classList.add('palette-cell');
        tr.appendChild(td);
        table.appendChild(tr);
        table.classList.add("color-palette");
        table.setAttribute('id', 'colorPalette');
        document.getElementById("canvasSide").insertBefore(table, document.getElementById("editorButtons"));
    }
}

function setCurrentColor(tableCell) {
    chosenColor = window.getComputedStyle(tableCell).getPropertyValue("background-color");
    console.log(`chosenColor = ${chosenColor}`);
}

function changeCellColor(color, tableCell) {
    tableCell.style.background = color;
    console.log("changing cell color");
}

function createImage() {
    let canvas = document.createElement("canvas");

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    let ctx = canvas.getContext('2d');
    
    let pixelCanvas = document.getElementById("pixelCanvas");
    if (pixelCanvas != null) {
        for (let i = 0; i < pixelCanvas.rows.length; i++) {
            for (let j = 0; j < pixelCanvas.rows[i].cells.length; j++)
            {
                const color = pixelCanvas.rows[i].cells[j].style.backgroundColor;
                console.log(color);
                ctx.fillStyle = color;
                ctx.fillRect( i, j, 1, 1 );
            }
        }
    }

    let downloadUrl = canvas.toDataURL();
    console.log(downloadUrl);

    let element = document.createElement('a');
    element.setAttribute('href', downloadUrl);
    element.setAttribute('download', "nes-pixel-image.png");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

