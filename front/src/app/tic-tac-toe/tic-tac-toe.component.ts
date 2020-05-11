import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import * as Stomp from 'stompjs';
import {Game} from "./models/game";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {

  uri: string;
  socket: WebSocket;
  ws: any;

  game: Game = new Game();
  readonly X_POINT: string = "X";
  readonly Y_POINT: string = "O";
  loading = true;
  awaitingPlayers = true;
  randomId: string;
  requestOfferSent = false;
  results: number[] = [];

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
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
      this.game.map[i] = ''
    }
  }

  isXOnField(i: number) {
    return this.game.map[i] == this.X_POINT;
  }

  isYOnField(i: number) {
    return this.game.map[i] == this.Y_POINT;
  }

  move(i: number) {
    if (this.game.state === 'CLOSED')
      return;
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
      that.ws.subscribe("/user/queue/tic/id", message => {
        that.randomId = message.body;
        that.loading = false;
      });
      that.ws.subscribe("/user/queue/tic", message => {
        that.game = JSON.parse(message.body);
        that.loading = false;
        if (that.game.state == 'CLOSED' && !that.game.oplayer.rematchRequestSend && !that.game.xplayer.rematchRequestSend) {
          if (that.game.draw) {
            alert('Remis')
            that.results.push(0);
          } else {

            alert('Gracz ' + (that.game.xplayer.winner ? 'X' : 'Y') + ' wygrał!');
            if ((that.game.oplayer.randomId === that.randomId && that.game.oplayer.winner)
              || (that.game.xplayer.randomId === that.randomId && that.game.xplayer.winner)) {
              that.results.push(1);
            } else {
              that.results.push(-1);
            }

          }
        }

        if (that.requestOfferSent) {
          that.requestOfferSent = false;
        }
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
      that.ws.subscribe("/user/queue/tic/id", message => {
        that.randomId = message.body;
        that.loading = false;
      });
      that.ws.subscribe("/user/queue/tic", message => {
        that.game = JSON.parse(message.body);
        that.loading = false;
        if (that.game.state == 'CLOSED' && !that.game.oplayer.rematchRequestSend && !that.game.xplayer.rematchRequestSend) {
          if (that.game.draw) {
            alert("Remis");
            that.results.push(0);
          } else {
            alert('Gracz ' + (that.game.xplayer.winner ? 'X' : 'Y') + ' wygrał!');
            if ((that.game.oplayer.randomId === that.randomId && that.game.oplayer.winner)
              || (that.game.xplayer.randomId === that.randomId && that.game.xplayer.winner)) {
              that.results.push(1);
            } else {
              that.results.push(-1);
            }

          }
        }

        if (that.requestOfferSent) {
          that.requestOfferSent = false;
        }
      });

      that.ws.subscribe("/user/queue/tic/uri", message => {
        that.uri = message.body;
      });


      that.ws.send("/app/tic/host", {}, {});
    }, function (error) {
      that.socket.close();
    });
  }

  isLoading() {
    return this.loading;
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
    this.openSnackbar('Skopiowano link do schowka')
  }

  openSnackbar(message: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.duration = 2000;
    config.panelClass = ['share-friend-bar'];
    this.snackBar.open(message, null, config);
  }

  sendRematchOffer() {
    if (this.requestOfferSent) {
      return;
    }
    this.requestOfferSent = true;
    this.ws.send("/app/tic/rematch/" + this.uri, {}, {});
  }
}
