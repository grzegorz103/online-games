import {Point} from "./point";

export class MoveHistory {

  move: string;
  boardCopy: Point[][];
  destMove: string;
  sourceMove: string;


  constructor(move: string, boardCopy: Point[][], destMove: string, sourceMove: string) {
    this.move = move;
    this.boardCopy = boardCopy;
    this.destMove = destMove;
    this.sourceMove = sourceMove;
  }
}
