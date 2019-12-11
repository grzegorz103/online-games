import { Component, OnInit } from '@angular/core';
import { Maze } from '../models/maze';
import { Player } from '../models/player';
import { Computer } from '../models/computer';
import { Point } from '../models/point';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss']
})
export class MazeComponent implements OnInit {

  player: Player;
  maze: Maze;
  loaded = false;
  computer: Computer;

  // gora dol lewo prawo
  directions = [0, 1, 2, 3];
  UP = 0;
  DOWN = 1;
  LEFT = 2;
  RIGHT = 3;

  constructor() {
    this.maze = this.generateMaze();
    this.createPlayer();
    this.loaded = true;
    this.computer = new Computer();
    this.computerMove();
  }

  ngOnInit() {
  }

  generateMaze() {
    return new Maze();
  }

  createPlayer() {
    this.player = new Player();
  }

  isPlayerOnField(i: number, j: number) {
    return this.player.row === i && this.player.col === j;
  }

  isComputerOnField(i: number, j: number) {
    return this.computer.row === i && this.computer.col === j;
  }

  computerMove() {
    let neighbours = this.neighbours(new Point(this.computer.row, this.computer.col));
    let move = 0;

    if (neighbours.some(e => e === this.computer.direction)) { // zmienic na if neighbours.length > 2 (gdy jest wiecej niz 2 mozliwe sciezzki)
      move = this.computer.direction;
    } else {
      move = neighbours[Math.floor(Math.random() * neighbours.length)];
    }

    switch (move) {
      case this.UP:
        this.computer.row -= 1;
        break;
      case this.DOWN:
        this.computer.row += 1;
        break;
      case this.LEFT:
        this.computer.col -= 1;
        break;
      case this.RIGHT:
        this.computer.col += 1;
        break;
    }
    
    this.computer.direction = move;

    setTimeout(()=>this.computerMove(), 100);
  }

  neighbours(point: Point): number[] {
    let neighbours = [];
    let x = point.x;
    let y = point.y;

    if (this.computer.row > 0 && this.maze.points[x - 1][y].isOccupied) {
      neighbours.push(this.UP);
    }
    if (this.computer.col > 0 && this.maze.points[x][y - 1].isOccupied) {
      neighbours.push(this.LEFT);
    }
    if (x < 28 && this.maze.points[x + 1][y].isOccupied) {
      neighbours.push(this.DOWN);
    }
    if (y < 28 && this.maze.points[x][y + 1].isOccupied) {
      neighbours.push(this.RIGHT);
    }

    return neighbours;
  }

}
