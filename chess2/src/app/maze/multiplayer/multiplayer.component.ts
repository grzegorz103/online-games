import {Component, HostListener, OnInit} from '@angular/core';
import {Maze} from "../models/maze";
import {Player} from "../models/player";
import {MazeComponent} from "../maze/maze.component";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

import * as Stomp from 'stompjs';
import {PlayerMulti} from "../models/player-multi";
import {environment} from "../../../environments/environment";
import {Point} from "../models/point";

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
  isWinner = false;

  ws: any;
  static loading = true;
  name: string;
  disabled: boolean;
  message: any;

  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient) {
    this.uri = this.route.snapshot.paramMap.get('game');
    let socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(socket);
    console.log('ccccc');
    if (this.uri) {
      this.getGameFromApi();
    } else { // nowa gra
      MultiplayerComponent.maze = this.generateMaze();
      MultiplayerComponent.maze.meta = this.createMetaPoint();
      this.uri = Math.random().toString(36).substring(8);
      this.sendMazeToApi();
    }
  }

  createMetaPoint() {
    let x: number;
    const y = 28;

    do {
      x = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
    } while (!MultiplayerComponent.maze.points[x][y].occupied);

    return new Point(x, y, null);
  }

  wsUrl() {
    return environment.wsUrl;
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
        // MultiplayerComponent.maze = JSON.parse(message.body);
        that.players = [];
        that.players = JSON.parse(message.body);
        MultiplayerComponent.loading = false;
      });

      that.ws.subscribe("/user/queue/win", message => {
        alert('Koniec');
        that.isWinner = true;
      });

      that.ws.send("/app/message/" + that.uri + '/' + MultiplayerComponent.maze.meta.row + '/' + MultiplayerComponent.maze.meta.col, {}, JSON.stringify(MultiplayerComponent.maze.points));
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
    return MultiplayerComponent.maze.meta.row === i && MultiplayerComponent.maze.meta.col === j;
  }

  isLoading() {
    return MultiplayerComponent.loading;
  }

  private getGameFromApi() {
    let that = this;
    if (!MultiplayerComponent.maze) {
      MultiplayerComponent.maze = new Maze();
    }
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });

      that.ws.subscribe("/user/queue/map", function (message) {
        MultiplayerComponent.maze.points = JSON.parse(message.body);
      });

      that.ws.subscribe("/user/queue/meta", function (message) {
        MultiplayerComponent.maze.meta = JSON.parse(message.body);
      });

      that.ws.subscribe("/user/queue/reply", message => {
        // MultiplayerComponent.maze = JSON.parse(message.body);
        that.players = [];
        that.players = JSON.parse(message.body);
        MultiplayerComponent.loading = false;
      });

      that.ws.subscribe("/user/queue/win", message => {
        alert('Koniec');
        that.isWinner = true;
      });

      that.ws.send("/app/message/" + that.uri + "/join", {}, {});
    }, function (error) {
      alert("STOMP error " + error);
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {

    if (this.isWinner)
      return;

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

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  moveByClick(value: number) {
    if (value < 1 || value > 4) {
      return;
    }


  }
}
