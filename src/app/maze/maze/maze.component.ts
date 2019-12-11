import { Component, OnInit, HostListener } from '@angular/core';
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
  meta: Point;
  // gora dol lewo prawo
  oppositeDirections = [1, 0, 3, 2];
  UP = 0;
  DOWN = 1;
  LEFT = 2;
  RIGHT = 3;

  constructor() {
    this.maze = this.generateMaze();
    this.createPlayer();
    this.loaded = true;
    this.createComputer();
    this.createMetaPoint();
    this.computerMove();
  }

  ngOnInit() {
  }

  generateMaze() {
    return new Maze();
  }

  createComputer(){
    let row, col;
    do {
      row = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
      col = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
    }
    while (!this.maze.points[row][col].isOccupied);
    this.computer = new Computer(row, col, 'Computer');
  }

  createPlayer() {
    this.player = new Player(0, 0, 'Player');
  }

  isPlayerOnField(i: number, j: number) {
    return this.player.row === i && this.player.col === j;
  }

  isComputerOnField(i: number, j: number) {
    return this.computer.row === i && this.computer.col === j;
  }

  computerMove() {
    let neighbours = this.neighbours(new Point(this.computer.row, this.computer.col, null));
    let move = 0;

    if (neighbours.some(e => e === this.computer.direction)) { // zmienic na if neighbours.length > 2 (gdy jest wiecej niz 2 mozliwe sciezzki)
      //    let random = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
      if (neighbours.length > 2) {
        move = neighbours.filter(e => e !== this.oppositeDirections[this.computer.direction])[Math.floor(Math.random() * (neighbours.length - 1))];
      } else {
        move = this.computer.direction;
      }
    } else {
      if (neighbours.length > 1) {
        // jezeli jest wiecej niz 1 sasiad to bierzemy lewego lub prawego
        move = neighbours.filter(e => e !== this.oppositeDirections[this.computer.direction])[Math.floor(Math.random() * (neighbours.length - 1))];
      } else {
        move = neighbours[Math.floor(Math.random() * neighbours.length)];
      }
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
    this.checkForWin(this.computer);

    setTimeout(() => this.computerMove(), 100);
  }

  neighbours(point: Point): number[] {
    let neighbours = [];
    let x = point.row;
    let y = point.col;

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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // event.key === 'ArrowUp'
    switch (event.key) {
      case 'ArrowUp':
        if (this.player.row > 0 && this.maze.points[this.player.row - 1][this.player.col].isOccupied)
          this.player.row -= 1;
        break;
      case 'ArrowDown':
        if (this.player.row < 28 && this.maze.points[this.player.row + 1][this.player.col].isOccupied)
          this.player.row += 1;
        break;
      case 'ArrowLeft':
        if (this.player.col > 0 && this.maze.points[this.player.row][this.player.col - 1].isOccupied)
          this.player.col -= 1;
        break;
      case 'ArrowRight':
        if (this.player.col < 28 && this.maze.points[this.player.row][this.player.col + 1].isOccupied)
          this.player.col += 1;
        break;
    }

    this.checkForWin(this.player);
  }

  createMetaPoint() {
    let x;
    let y = 28;

    do{
      x = Math.floor(Math.random() * (28 - 1 + 1)) + 1
    }while(!this.maze.points[x][x].isOccupied);

    this.meta = new Point(x, y, null);
  }

  isMetaOnField(row: number, col: number){
    return this.meta.row === row && this.meta.col === col;
  }

  checkForWin(point: Point){
    if(point.row === this.meta.row && point.col === this.meta.col){
      alert(point.name + ' has won the game!!!');
    }
  }
}
