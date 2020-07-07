import {Injectable} from '@angular/core';
import {MoveHistory} from "../models/move-history";

@Injectable({
  providedIn: 'root'
})
export class MoveHistoryProviderService {

  moveHistories: MoveHistory[] = [];

  constructor() {
  }

  addMove(moveHistory: MoveHistory) {
    this.moveHistories.push(moveHistory);
  }

  clear() {
    this.moveHistories = [];
  }

}
