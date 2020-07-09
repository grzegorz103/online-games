import {ChessMultiplayerComponent} from "../chess-multiplayer.component";

export class Timer {

  private currentPlayerTime: number;
  private enemyPlayerTime: number;
  private _currentPlayerTimeString: string;
  private _enemyPlayerTimeString: string;

  private readonly timeChoosen: number;

  private timeMsInterval: number = 10;

  private timer: any;

  constructor(timeChoosen: number) {
    this.currentPlayerTime = timeChoosen;
    this.enemyPlayerTime = timeChoosen;
    this.calculateTimeStrings();
    this.timeChoosen = timeChoosen;
  }

  start() {
    this.timer = setInterval(() => this.run(), this.timeMsInterval);
  }

  clear() {
    this.currentPlayerTime = this.timeChoosen;
    this.enemyPlayerTime = this.timeChoosen;
    this.calculateTimeStrings();
  }

  private calculateTimeStrings() {
    this._currentPlayerTimeString = new Date(this.currentPlayerTime * 1000).toISOString().substring(11, 19);
    this._enemyPlayerTimeString = new Date(this.enemyPlayerTime * 1000).toISOString().substring(11, 19);
  }

  private run() {
    if (!ChessMultiplayerComponent.isGameFinished) {
      if (ChessMultiplayerComponent.isCurrentPlayer) {
        this.currentPlayerTime -= 0.01;
        this._currentPlayerTimeString = new Date(this.currentPlayerTime * 1000).toISOString().substring(11, 19);
      } else {
        this.enemyPlayerTime -= 0.01;
        this._enemyPlayerTimeString = new Date(this.enemyPlayerTime * 1000).toISOString().substring(11, 19);
      }
      if (this.currentPlayerTime === 0 || this.enemyPlayerTime === 0) {
        alert('Koniec czasu');
        clearInterval(this.timer);
        ChessMultiplayerComponent.isGameFinished = true;
      }
    }
  }

  get currentPlayerTimeString(): string {
    return this._currentPlayerTimeString;
  }

  get enemyPlayerTimeString(): string {
    return this._enemyPlayerTimeString;
  }
}
