import {Component, HostListener, OnInit} from '@angular/core';
import {Maze} from "../models/maze";
import {Player} from "../models/player";
import {MazeComponent} from "../maze/maze.component";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

import * as Stomp from 'stompjs';
import {PlayerMulti} from "../models/player-multi";

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit {

  static maze: Maze;
//  player: Player= new Player(0,0,'Player');
  players: PlayerMulti[] = [];
  uri: string;

  ws: any;
  static loading = true;
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
  }

  private sendMazeToApi() {
    //  this.httpClient.post('http://localhost:8080/api/maze?gameUri=' + this.uri, MultiplayerComponent.maze.points)
    //   .subscribe((res=>console.log(MultiplayerComponent.maze.points)));
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/user/queue/reply", message => {
        MultiplayerComponent.maze = JSON.parse(message.body);
        that.players = [];
        that.players = MultiplayerComponent.maze.players;
        MultiplayerComponent.loading = false;
      });

      that.ws.send("/app/message/" + that.uri, {}, JSON.stringify(MultiplayerComponent.maze.points));
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
    return this.players.some(e => e.point.row === i && e.point.col === j);
  }

  getMazePoints() {
    return MultiplayerComponent.maze && MultiplayerComponent.maze.points;
  }

  getMaze() {
    return MultiplayerComponent.maze !== undefined;
  }

  isMetaOnField(i: number, j: number) {
    return false;
  }

  private getGameFromApi() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/user/queue/reply", message => {
        MultiplayerComponent.maze = JSON.parse(message.body);
        that.players = [];
        that.players = MultiplayerComponent.maze.players;
        MultiplayerComponent.loading = false;
      });


      that.ws.send("/app/message/" + that.uri + "/join", {}, {});
    }, function (error) {
      alert("STOMP error " + error);
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // event.key === 'ArrowUp'
    switch (event.key) {
      case 'w':
        this.ws.send("/app/message/" + this.uri + "/move/" + 1, {}, {});
        break;
      case 's':
        this.ws.send("/app/message/" + this.uri + "/move/" + 2, {}, {});
        break;
      case 'a':
        this.ws.send("/app/message/" + this.uri + "/move/" + 3, {}, {});
        break;
      case 'd':
        this.ws.send("/app/message/" + this.uri + "/move/" + 4, {}, {});
        break;
    }

  }
}
