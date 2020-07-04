import {AbstractPiece} from "../abstract-piece";
import {Point} from "../../point";

export abstract class AbstractPieceDecorator implements AbstractPiece {

  piece: AbstractPiece;
  pointClicked: Point;

  constructor(piece: AbstractPiece, pointClicked: Point) {
    this.piece = piece;
    console.log(this.piece)
    this.pointClicked = pointClicked;
  }

  abstract getPossibleCaptures(): Point[];

  abstract getPossibleMoves(): Point[];

}
