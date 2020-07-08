import {Point} from "./point";

export class MoveHistory {

  move: string;
  boardCopy: Point[][];

  constructor(move: string, boardCopy: Point[][]) {
    this.move = move;
    this.boardCopy = boardCopy;
  }

}
