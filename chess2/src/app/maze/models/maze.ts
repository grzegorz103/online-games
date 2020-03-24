import { Point } from './point';
declare var require: any

export class Maze {
    points: Point[][];
    shuffle = require('shuffle-array');

    constructor() {
        this.points = [];

        for (var i = 0; i < 30; ++i) {
            this.points[i] = [];
            for (var j = 0; j < 30; ++j) {
                this.points[i][j] = new Point(i, j, null);
            }
        }

        this.initGenerating(this.points[0][0]);
    }

    initGenerating(point: Point) {
        point.isOccupied = true;
        let neighbours = this.neighbours(point);

        let newArr = this.shuffle(neighbours) as Point[];

        for (let neighbour of newArr) {
            if (neighbour && !neighbour.isOccupied) {
                this.points[(point.row + neighbour.row) / 2][(point.col + neighbour.col) / 2].isOccupied = true;
                this.initGenerating(neighbour);
            }
        }
    }

    neighbours(point: Point): Point[] {
        let neighbours = [];
        let x = point.row;
        let y = point.col;
        if (point.row > 1 && !this.points[x - 2][y].isOccupied) {
            neighbours.push(this.points[x - 2][y]);
        }
        if (point.col > 1 && !this.points[x][y - 2].isOccupied) {
            neighbours.push(this.points[x][y - 2])
        }
        if (x < 28 && !this.points[x + 2][y].isOccupied) {
            neighbours.push(this.points[x + 2][y]);
        }
        if (y < 28 && !this.points[x][y + 2].isOccupied) {
            neighbours.push(this.points[x][y + 2]);
        }

        return neighbours;
    }

}