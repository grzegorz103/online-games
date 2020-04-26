import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {

  uri: string;
  socket: WebSocket;
  ws: any;

  grid: string[] = [];
  readonly X_POINT: string = "X";
  readonly Y_POINT: string = "O";

  constructor(private route: ActivatedRoute) {
    this.uri = this.route.snapshot.paramMap.get('game');
    this.socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(this.socket);
    this.ws.heartbeat.outgoing = 5000;
    this.ws.heartbeat.incomingng = 5000;

    if (this.uri) {
      this.getGameFromApi();
    } else { // nowa gra
      this.sendGameToApi();
    }
  }

  ngOnInit() {
    this.initGrid();
  }

  initGrid() {
    for (let i: number = 0; i < 9; i++) {
      this.grid[i] = ''
    }
  }

  isXOnField(i: number) {
    return this.grid[i] == this.X_POINT;
  }

  isYOnField(i: number) {
    return this.grid[i] == this.Y_POINT;
  }

  move(i: number) {
    this.ws.send('/app/tic/move/' + this.uri + '/' + i);
  }

  apiUrl() {
    return environment.appUrl;
  }

  private getGameFromApi() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/user/queue/tic", message => {
        that.grid = JSON.parse(message.body);
      });

      that.ws.send("/app/tic/join/" + that.uri, {}, {});
    }, function (error) {
      that.socket.close();
    });
  }

  private sendGameToApi() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/user/queue/tic", message => {
        that.grid = JSON.parse(message.body);
        console.log('gr')
      });

      that.ws.subscribe("/user/queue/tic/uri", message => {
        that.uri = message.body;
      });

      that.ws.send("/app/tic/host", {}, {});
    }, function (error) {
      that.socket.close();
    });
  }
}
