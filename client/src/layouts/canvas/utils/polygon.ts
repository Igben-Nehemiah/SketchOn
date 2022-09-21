import Point from "./point";

class Polygon {
    private isSelected: boolean = false;
    constructor(
        public centerX: number,
        public centerY: number,
        public radius: number,
        public sides: number,
        public startAngle: number,
        public strokeStyle: string,
        public fillStyle: string,
        public filled: boolean
    ) {}

    getPoints() {
        var points = [],
            angle = this.startAngle || 0;

        for (var i = 0; i < this.sides; ++i) {
            points.push(
                new Point(
                    this.centerX + this.radius * Math.sin(angle),
                    this.centerY - this.radius * Math.cos(angle)
                )
            );
            angle += (2 * Math.PI) / this.sides;
        }
        return points;
    }

    createPath(context: CanvasRenderingContext2D) {
        var points = this.getPoints();

        context.beginPath();

        context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < this.sides; ++i) {
            context.lineTo(points[i].x, points[i].y);
        }

        context.closePath();
    }

    stroke(context: CanvasRenderingContext2D) {
        context.save();
        this.createPath(context);
        context.strokeStyle = this.strokeStyle;
        context.stroke();
        context.restore();
    }

    fill(context: CanvasRenderingContext2D) {
        context.save();
        this.createPath(context);
        context.fillStyle = this.fillStyle;
        context.fill();
        context.restore();
    }

    move(x: number, y: number) {
        this.centerX = x;
        this.centerY = y;
    }

    set IsSelected(value: boolean) {
        this.isSelected = value;
    }

    get IsSelected() {
        return this.isSelected;
    }
}

export default Polygon;
