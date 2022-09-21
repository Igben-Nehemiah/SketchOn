import { Polygon, Point } from "./utils";

type Rect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

const canvasContainer = document.querySelector(".canvas-container")!;
const canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
const ctx = canvas.getContext("2d")!;
let drawingSurfaceImageData: ImageData;

let dragging = false;
let editing = false;
let selectedPolygon: Polygon;
let draggingOffsetX: number;
let draggingOffsetY: number;
let rubberbandRect: Rect;
let mousedown: Point;
let polygons: Polygon[] = [];

function createCanvas() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid({ context: ctx, color: "black", stepx: 10, stepy: 10 });
    return ctx;
}

function resizeCanvas() {
    canvas.width = 2000;
    canvas.height = canvasContainer.clientHeight;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid({ context: ctx, color: "black", stepx: 10, stepy: 10 });
}

function drawGrid({
    context,
    color,
    stepx,
    stepy,
}: {
    context: CanvasRenderingContext2D;
    color: string;
    stepx: number;
    stepy: number;
}): void {
    context.save();

    context.strokeStyle = color;
    context.fillStyle = "#ffffff";
    context.lineWidth = 0.5;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.globalAlpha = 0.1;

    context.beginPath();
    for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
    }
    context.stroke();

    context.beginPath();
    for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
    }
    context.stroke();
    context.restore();
}

// Saving/Restoring the drawing surface..........................
function saveDrawingSurface() {
    drawingSurfaceImageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function restoreDrawingSurface() {
    ctx.putImageData(drawingSurfaceImageData, 0, 0);
}

// Draw a polygon.....................................................
function drawPolygon(polygon: Polygon) {
    ctx.beginPath();
    polygon.createPath(ctx);
    polygon.stroke(ctx);

    if (false) {
        polygon.fill(ctx);
    }
}

// Rubberbands........................................................
function updateRubberbandRectangle(loc: Point) {
    rubberbandRect = {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
    };
    rubberbandRect.width = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);

    if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
    else rubberbandRect.left = loc.x;

    if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
    else rubberbandRect.top = loc.y;
}

function drawRubberbandShape(loc: Point, sides: number, startAngle: number) {
    var polygon = new Polygon(
        mousedown.x,
        mousedown.y,
        rubberbandRect.width,
        4,
        0,
        ctx.strokeStyle,
        ctx.fillStyle,
        true
    );
    drawPolygon(polygon);

    if (!dragging) {
        polygons.push(polygon);
    }
}

function updateRubberband(loc: Point, sides: number, startAngle: number) {
    updateRubberbandRectangle(loc);
    drawRubberbandShape(loc, sides, startAngle);
}

// Guidewires....................................................
function drawHorizontalLine(y: number) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(canvas.width, y + 0.5);
    ctx.stroke();
}

function drawVerticalLine(x: number) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, canvas.height);
    ctx.stroke();
}

function drawGuidewires(x: number, y: number) {
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,230,0.4)";
    ctx.lineWidth = 0.5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
    ctx.restore();
}

function drawPolygons() {
    polygons.forEach((polygon) => drawPolygon(polygon));
}

// Dragging...........................................................
function startDragging(loc: Point) {
    saveDrawingSurface();
    mousedown = new Point(loc.x, loc.y);
}

function startEditing() {
    canvas.style.cursor = "pointer";
    editing = true;
}

function stopEditing() {
    canvas.style.cursor = "crosshair";
    editing = false;
}

// Event handling functions......................................
function windowToCanvas(x: number, y: number) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height),
    };
}

// Drawing canvas event handlers.................................
canvas.onmousedown = function (e: MouseEvent) {
    let loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();

    if (editing) {
        polygons.forEach((polygon) => {
            polygon.createPath(ctx);
            if (ctx.isPointInPath(loc.x, loc.y)) {
                startDragging(loc);
                selectedPolygon = polygon;
                polygon.IsSelected = true;
                dragging = true;
                draggingOffsetX = loc.x - polygon.centerX;
                draggingOffsetY = loc.y - polygon.centerY;
            } else {
                polygon.IsSelected = false;
            }
        });
    } else {
        startDragging(loc);
        dragging = true;
    }
};

canvas.onmousemove = function (e) {
    let loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();
    if (editing && dragging) {
        selectedPolygon.centerX = loc.x - draggingOffsetX;
        selectedPolygon.centerY = loc.y - draggingOffsetY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid({ context: ctx, color: "lightgray", stepx: 10, stepy: 10 });
        drawPolygons();
    } else {
        if (dragging) {
            restoreDrawingSurface();
            updateRubberband(loc, 4, 0);

            if (true) {
                drawGuidewires(mousedown.x, mousedown.y);
            }
        }
    }
};

canvas.onmouseup = function (e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    dragging = false;

    if (editing) {
    } else {
        restoreDrawingSurface();
        updateRubberband(loc, 4, 0);
    }
};

let editCheckbox = (document.getElementById(
    "editCheckbox"
) as HTMLInputElement)!;

editCheckbox.onchange = function (e) {
    if (editCheckbox.checked) {
        startEditing();
    } else {
        stopEditing();
    }
};

export { createCanvas, resizeCanvas };
