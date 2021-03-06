import {Piece} from './piece';
import {Color} from './color';
import {Point} from '../point';
import {ChessMultiplayerComponent} from "../../chess-multiplayer.component";

export class Pawn extends Piece {

  isMovedAlready = false;

  constructor(color: Color, image: string, unicode: string) {
    super(color, image, 1, unicode);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];
    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    if ((ChessMultiplayerComponent.isWhiteBottom && this.color === Color.WHITE) || (!ChessMultiplayerComponent.isWhiteBottom && this.color === Color.BLACK)) {
      if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));

        if (!this.isMovedAlready && ChessMultiplayerComponent.isFieldEmpty(row - 2, col)) {
          possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col));
        }
      }

      if (ChessMultiplayerComponent.enPassantable != null && (ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1) === ChessMultiplayerComponent.enPassantPoint
        || ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1) === ChessMultiplayerComponent.enPassantPoint)) {
        possiblePoints.push(ChessMultiplayerComponent.enPassantPoint);
      }
    } else {
      if (/*!ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ ChessMultiplayerComponent.isFieldEmpty(row + 1, col)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));

        if (!this.isMovedAlready && ChessMultiplayerComponent.isFieldEmpty(row + 2, col)) {
          possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col));
        }
      }
      if (ChessMultiplayerComponent.enPassantable != null && (ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1) === ChessMultiplayerComponent.enPassantPoint
        || ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1) === ChessMultiplayerComponent.enPassantPoint)) {
        console.log('dddd')
        possiblePoints.push(ChessMultiplayerComponent.enPassantPoint);
      }
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];
    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    if ((ChessMultiplayerComponent.isWhiteBottom && this.color === Color.WHITE) || (!ChessMultiplayerComponent.isWhiteBottom && this.color === Color.BLACK)) {
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));
      }
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
      }
    } else {
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
      }
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));
      }
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];
    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    if (this.color === Color.WHITE) {

      if (ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1))
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));

      if (ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1))
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
    } else {

      if (ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1))
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));

      if (ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1))
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
    }

    return possiblePoints;
  }

}
