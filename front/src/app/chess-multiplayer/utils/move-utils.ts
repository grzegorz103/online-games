import {Color} from "../models/pieces/color";
import {ChessMultiplayerComponent} from "../chess-multiplayer.component";

export class MoveUtils {

  public static willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number) {
    let tempBoard = ChessMultiplayerComponent.board;
    /*  BoardComponent.pieces = BoardComponent.pieces.filter(piece =>
        (piece.point.col !== col) || (piece.point.row !== row)
      );*/
    let srcPiece = ChessMultiplayerComponent.getPointByCoords(row, col);
    let destPiece = ChessMultiplayerComponent.getPointByCoords(destRow, destCol);

    let tempPiece = null;
    if (destPiece.piece) {
      tempPiece = destPiece.piece;
    }

    if (srcPiece) {
      destPiece.piece = srcPiece.piece;
      srcPiece.piece = null;
    }

    let isBound = ChessMultiplayerComponent.isKingInCheck(currentColor);

    if (srcPiece) {
      srcPiece.piece = destPiece.piece;
    }

    if (destPiece.piece) {
      destPiece.piece = tempPiece;
    }

    return isBound;
  }

}
