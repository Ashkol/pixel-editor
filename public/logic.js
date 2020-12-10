const CANVAS_SIZE = 16;
const STROKE_LENGTH = 100;
const STROKES_REMEMBERED = 20;
let chosenColor;
let prevColor;
let isDragging;
let paintQueue = [];
let strokeQueue = [];
setup();

function setup() {
    createPixelCanvas(CANVAS_SIZE);
    createColorPalette(5);
    setCanvasListeners();
    setColorPaletteListeners();
    document.getElementById("buttonCancel").addEventListener('click', reverseStroke);
    document.getElementById("buttonSave").addEventListener('click', downloadImage);
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
                    addToPaintQueue(prevColor, cell);
                }
                function leave () {
                    if (!isDragging) {
                        changeCellColor(prevColor, cell);
                        removeFromPaintQueue();
                    }
                }

                function setDrag (dragActive) {
                    isDragging = dragActive;
                    prevColor = cell.style.backgroundColor;
                    changeCellColor(chosenColor, cell);
                    if (dragActive == false) {
                        addPaintToStroke();
                    }
                }

                cell.addEventListener('mouseenter', enter);
                cell.addEventListener('mouseleave', leave);
                cell.addEventListener('mousedown', function() {setDrag(true);});
                cell.addEventListener('mouseup', function() {setDrag(false);});
            }
        }
    }
}

function setColorPaletteListeners() {
    const colorPalette = document.getElementById("colorPalette");
    if (colorPalette != null) {
        for (let i = 0; i < colorPalette.rows.length; i++) {
            for (let j = 0; j < colorPalette.rows[i].cells.length; j++)
            colorPalette.rows[i].cells[j].onclick = function () {
                chosenColor = window.getComputedStyle(this).getPropertyValue("background-color");
            };
        }
    }
}

function addPaintToStroke() {
    if (strokeQueue.length > STROKES_REMEMBERED) {
        strokeQueue.shift();
    }
    strokeQueue.push(paintQueue);
        paintQueue = [];
}

function removeFromPaintQueue() {
    if (paintQueue.length > 0) {
        paintQueue.pop();
    }
}

function addToPaintQueue(prevColor, cell) {
    if (paintQueue.length > STROKE_LENGTH) {
        paintQueue.shift();
    }
    paintQueue.push({prevColor, cell})
}

function reverseStroke() {
    if (strokeQueue.length > 0) {
        const stroke = strokeQueue[strokeQueue.length-1];
        for (let i = stroke.length-1; i >= 0; i--) {
            changeCellColor(stroke[i].prevColor, stroke[i].cell);
        }
        strokeQueue.pop();
    }
}

function changeCellColor(color, tableCell) {
    tableCell.style.background = color;
}

function downloadImage() {
    let canvas = document.createElement("canvas");

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    let ctx = canvas.getContext('2d');
    
    let pixelCanvas = document.getElementById("pixelCanvas");
    if (pixelCanvas != null) {
        for (let i = 0; i < pixelCanvas.rows.length; i++) {
            for (let j = 0; j < pixelCanvas.rows[i].cells.length; j++)
            {
                const color = pixelCanvas.rows[i].cells[j].style.backgroundColor;
                console.log(color);
                ctx.fillStyle = color;
                ctx.fillRect( j, i, 1, 1 );
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