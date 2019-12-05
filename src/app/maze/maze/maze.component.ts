import { Component, OnInit } from '@angular/core';
import { Maze } from '../models/maze';
import { Player } from '../models/player';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.scss']
})
export class MazeComponent implements OnInit {

  player: Player;
  maze: Maze;
  loaded = false;

  constructor() {
    this.maze = this.generateMaze();
    this.createPlayer();
    this.loaded = true;
  }

  ngOnInit() {
  }

  generateMaze() {
    return new Maze();
  }

  createPlayer() {
    this.player = new Player();
  }

  isPlayerOnField(i: number, j : number){
    return this.player.row === i && this.player.col === j;
  }

}
