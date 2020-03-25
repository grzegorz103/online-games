import {Component, OnInit} from '@angular/core';
import {Maze} from "../models/maze";
import {Player} from "../models/player";
import {MazeComponent} from "../maze/maze.component";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

import * as Stomp from 'stompjs';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit {

  loaded = false;
  static maze: Maze;
//  player: Player= new Player(0,0,'Player');
  players: Player[] = [];
  uri: string;

  ws: any;
  name: string;
  disabled: boolean;
  message: any;

  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient) {
    this.uri = this.route.snapshot.paramMap.get('game');
    let socket = new WebSocket("ws://localhost:8080/chat");
    this.ws = Stomp.over(socket);
    console.log('ccccc');
    if (this.uri) {
      this.getGameFromApi();
    } else { // nowa gra
      MultiplayerComponent.maze = this.generateMaze();
      this.uri = Math.random().toString(36).substring(4);
      this.sendMazeToApi();
    }
    this.loaded = true;
  }

  private sendMazeToApi() {
    //  this.httpClient.post('http://localhost:8080/api/maze?gameUri=' + this.uri, MultiplayerComponent.maze.points)
    //   .subscribe((res=>console.log(MultiplayerComponent.maze.points)));
    let that = this;
    this.ws.connect({}, function (frame) {
      console.log('a');
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/topic/reply", message => {
        console.log(message);
        that.players = [];
        that.players.push(message.body);
      });
      that.ws.send("/app/message/" + that.uri , {}, JSON.stringify(MultiplayerComponent.maze.points));
    }, function (error) {
      alert("STOMP error " + error);
    });
  }

  ngOnInit() {
  }

  generateMaze() {
    return new Maze();
  }

  isPlayerOnField(i: number, j: number) {
    return this.players.some(e => e.row === i && e.col === j);
  }

  getMazePoints() {
    return MultiplayerComponent.maze.points;
  }

  getMaze() {
    return MultiplayerComponent.maze;
  }

  isMetaOnField(i: number, j: number) {
    return false;
  }

  private getGameFromApi() {
    let that = this;
    this.ws.connect({}, function (frame) {
      console.log('a');
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/topic/reply", message => {
        console.log(message);
        that.players = [];
        that.players.push(message.body);
      });

      that.ws.subscribe("/topic/map", message => {
        console.log(message);
        MultiplayerComponent.maze = message.body;
      });
      that.ws.send("/app/message/" + that.uri + "/join", {}, {});
    }, function (error) {
      alert("STOMP error " + error);
    });
  }
}
