import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {ChessMultiplayerComponent} from "../chess-multiplayer.component";

export class Pawn extends Piece {

  isMovedAlready = false;

  constructor(color: Color, image: string) {
    super(color, image, 1);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];
    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    if (ChessMultiplayerComponent.currentColor === Color.WHITE) {
console.log('nie ma')
      if (this.color === Color.WHITE) {
        if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col)) {
          possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));

          if (!this.isMovedAlready && ChessMultiplayerComponent.isFieldEmpty(row - 2, col)) {
            possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col));
          }
        }
      } else {
        if (/*!ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ ChessMultiplayerComponent.isFieldEmpty(row + 1, col)) {
          possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));

          if (!this.isMovedAlready && ChessMultiplayerComponent.isFieldEmpty(row + 2, col)) {
            possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col));
          }
        }
      }
    } else {
      console.log('jest')
      if (this.color === Color.WHITE) {
        if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col)) {
          possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));

          if (!this.isMovedAlready && ChessMultiplayerComponent.isFieldEmpty(row + 2, col)) {
            possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col));
          }
        }
      } else {
        if (/*!ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ ChessMultiplayerComponent.isFieldEmpty(row - 1, col)) {
          possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));

          if (!this.isMovedAlready && ChessMultiplayerComponent.isFieldEmpty(row - 2, col)) {
            possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col));
          }
        }
      }
    }
    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];
    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;
    if (this.color === Color.WHITE) {
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 1, Color.BLACK)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));
      }
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 1, Color.BLACK)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
      }
    } else {
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 1, Color.WHITE)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));
      }
      if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 1, Color.WHITE)) {
        possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
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

      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));

      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
    } else {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));

      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
    }

    return possiblePoints;
  }

}
