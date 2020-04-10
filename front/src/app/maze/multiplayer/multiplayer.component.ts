import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Maze} from "../models/maze";
import {Player} from "../models/player";
import {MazeComponent} from "../maze/maze.component";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

import * as Stomp from 'stompjs';
import {PlayerMulti} from "../models/player-multi";
import {environment} from "../../../environments/environment";
import {Point} from "../models/point";
import {Message} from "../models/message";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit, OnDestroy {

  static maze: Maze;
//  player: Player= new Player(0,0,'Player');
  players: PlayerMulti[] = [];
  uri: string;
  isWinner = false;

  ws: any;
  static loading = true;
  name: string;
  disabled: boolean;
  message: Message = new Message();
  messages: Message[] = [];
  username: string;
  socket: WebSocket;

  constructor(private route: ActivatedRoute,
              public snackBar: MatSnackBar,
              private auth: AuthService,
              private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.uri = this.route.snapshot.paramMap.get('game');
    this.socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(this.socket);
    this.ws.heartbeat.outgoing = 5000;
    this.ws.heartbeat.incomingng = 5000;

    if (this.auth.loggedIn) {
      this.auth.userProfile$.subscribe(res => this.username = res.nickname);
    } else {
      do {
        this.username = prompt('Wprowadz swój nick');
      } while (!this.username);
    }

    if (this.uri) {
      this.getGameFromApi();
    } else { // nowa gra
      MultiplayerComponent.maze = this.generateMaze();
      MultiplayerComponent.maze.meta = this.createMetaPoint();
      this.uri = Math.random().toString(36).substring(8);
      this.sendMazeToApi();
    }

  }

  ngOnDestroy(): void {
    this.socket.close();
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

  apiUrl() {
    return environment.appUrl;
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

      that.ws.subscribe("/user/queue/dm", message => {
        that.messages.push(JSON.parse(message.body));
      });

      that.ws.subscribe("/user/queue/win", message => {
        alert('Koniec');
        that.isWinner = true;
      });

      that.ws.send("/app/message/" + that.uri + '/' + MultiplayerComponent.maze.meta.row + '/' + MultiplayerComponent.maze.meta.col + "/" + that.username, {}, JSON.stringify(MultiplayerComponent.maze.points));
    }, function (error) {
      that.socket.close();
    });
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

      that.ws.subscribe("/user/queue/dm", message => {
        that.messages.push(JSON.parse(message.body));
      });

      that.ws.send("/app/message/" + that.uri + "/" + that.username + "/join", {}, {});
    }, function (error) {
      that.socket.close();
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
    this.openSnackbar('Skopiowano do schowka')
  }

  moveByClick(value: number) {
    if (value < 1 || value > 4) {
      return;
    }

    this.ws.send("/app/message/" + this.uri + "/move/" + value, {}, {});
  }

  sendMessage() {
    if (this.message && this.message.message) {
      this.ws.send("/app/message/" + this.uri + "/send", {}, JSON.stringify(this.message))
    }
  }

  openSnackbar(message: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.duration = 2000;
    this.snackBar.open(message, null, config);
  }

}
