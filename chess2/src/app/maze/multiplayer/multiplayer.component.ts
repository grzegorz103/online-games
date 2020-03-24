import {Component, OnInit} from '@angular/core';
import {Maze} from "../models/maze";
import {Player} from "../models/player";
import {MazeComponent} from "../maze/maze.component";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit {

  loaded = false;
  static maze: Maze;
  player: Player= new Player(0,0,'Player');

  uri: string;

  ws: any;
  name: string;
  disabled: boolean;
  message: any;

  constructor(private route:ActivatedRoute,
              private httpClient: HttpClient) {
    this.uri = this.route.snapshot.paramMap.get('game');

    if(this.uri){

    }else { // nowa gra
      MultiplayerComponent.maze = this.generateMaze();
      this.sendMazeToApi();
    }
    this.loaded = true;
    this.uri = Math.random().toString(36).substring(4);
  }

  private sendMazeToApi() {
    this.httpClient.post('http://localhost:8080/api/maze?gameUri=' + this.uri, MultiplayerComponent.maze.points)
      .subscribe((res=>console.log(MultiplayerComponent.maze.points)));
  }

  ngOnInit() {
  }

  generateMaze() {
    return new Maze();
  }

  isPlayerOnField(i: number, j: number) {
    return this.player.row === i && this.player.col === j;
  }

  getMazePoints() {
    return MultiplayerComponent.maze.points;
  }

  isMetaOnField(i: number, j: number) {
    return false;
  }
}
