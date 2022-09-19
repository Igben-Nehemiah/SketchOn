function createCanvas() {
    const canvasContainer = document.querySelector(".canvas-container")!;
    const canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, "black", 10, 10);
}

function drawGrid(
    context: CanvasRenderingContext2D,
    color: string,
    stepx: number,
    stepy: number
) {
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

export { createCanvas };
