import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {

  grid: string[] = [];
  readonly X_POINT: string = 'X';
  readonly Y_POINT: string = 'Y';

  constructor() {
  }

  ngOnInit() {
    this.initGrid();
  }

  initGrid() {
    for (let i: number = 0; i < 9; i++) {
      this.grid[i] = ''
    }
  }

  isXOnField(i: number){
    return this.grid[i] == this.X_POINT;
  }

  isYOnField(i: number){
    return this.grid[i] == this.Y_POINT;
  }

  move(i: number){
    this.grid[i] = this.Y_POINT;
  }
}
