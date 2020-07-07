import {AbstractPieceDecorator} from "./abstract-piece-decorator";
import {Point} from "../../point";
import {MoveUtils} from "../../../utils/move-utils";
import {Color} from "../color";
import {AbstractPiece} from "../abstract-piece";

export class AvailableMoveDecoratorImpl extends AbstractPieceDecorator {

  pointClicked: Point;

  constructor(piece: AbstractPiece, pointClicked: Point) {
    super(piece);
    this.pointClicked = pointClicked;
  }

  getPossibleCaptures(): Point[] {

    return this.piece.getPossibleCaptures()
      .filter(point => !MoveUtils.willMoveCauseCheck(this.pointClicked.piece.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col));
  }

  getPossibleMoves(): Point[] {
    return this.piece.getPossibleMoves()
      .filter(point => !MoveUtils.willMoveCauseCheck(this.pointClicked.piece.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col));
  }

}
