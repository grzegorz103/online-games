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
  readonly X_POINT: string = 'X';
  readonly Y_POINT: string = 'Y';

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

  isXOnField(i: number){
    return this.grid[i] == this.X_POINT;
  }

  isYOnField(i: number){
    return this.grid[i] == this.Y_POINT;
  }

  move(i: number){
    this.grid[i] = this.Y_POINT;
  }

  private getGameFromApi() {

  }

  private sendGameToApi() {

  }
}
