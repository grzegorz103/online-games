import {Point} from './point';
import {PlayerMulti} from "./player-multi";

declare var require: any

export class Maze {
  points: Point[][];
  shuffle = require('shuffle-array');
  players: PlayerMulti[];
  meta: Point;

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
    point.occupied = true;
    let neighbours = this.neighbours(point);

    let newArr = this.shuffle(neighbours) as Point[];

    for (let neighbour of newArr) {
      if (neighbour && !neighbour.occupied) {
        this.points[(point.row + neighbour.row) / 2][(point.col + neighbour.col) / 2].occupied = true;
        this.initGenerating(neighbour);
      }
    }
  }

  neighbours(point: Point): Point[] {
    let neighbours = [];
    let x = point.row;
    let y = point.col;
    if (point.row > 1 && !this.points[x - 2][y].occupied) {
      neighbours.push(this.points[x - 2][y]);
    }
    if (point.col > 1 && !this.points[x][y - 2].occupied) {
      neighbours.push(this.points[x][y - 2])
    }
    if (x < 28 && !this.points[x + 2][y].occupied) {
      neighbours.push(this.points[x + 2][y]);
    }
    if (y < 28 && !this.points[x][y + 2].occupied) {
      neighbours.push(this.points[x][y + 2]);
    }

    return neighbours;
  }

}
