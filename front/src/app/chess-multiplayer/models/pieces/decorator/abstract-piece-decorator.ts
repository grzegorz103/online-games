import {AbstractPiece} from "../abstract-piece";
import {Point} from "../../point";

export abstract class AbstractPieceDecorator implements AbstractPiece {

  piece: AbstractPiece;

  constructor(piece: AbstractPiece) {
    this.piece = piece;
  }

  abstract getPossibleCaptures(): Point[];

  abstract getPossibleMoves(): Point[];

}
