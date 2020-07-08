import {Injectable} from '@angular/core';
import {MoveHistory} from "../models/move-history";

@Injectable({
  providedIn: 'root'
})
export class MoveHistoryProviderService {

  public moveHistories: MoveHistory[] = [];

  constructor() {
  }

  addMove(moveHistory: MoveHistory) {
    this.moveHistories.push(moveHistory);
  }

  clear() {
    this.moveHistories = [];
  }

  getMove(index: number) {
    return this.moveHistories[index];
  }

  getLast() {
    return this.moveHistories[this.moveHistories.length - 1];
  }

  getSize() {
    return this.moveHistories.length;
  }

}
