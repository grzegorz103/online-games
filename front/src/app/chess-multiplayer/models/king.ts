import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {ChessMultiplayerComponent} from "../chess-multiplayer.component";
import {Rook} from "./rook";

export class King extends Piece {

  castledAlready = false;
  shortCastled = false;
  longCastled = false;
  isMovedAlready;
  isCastling = false;

  constructor(point: Point, color: Color, image: string) {
    super(point, color, image, 0);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;
    // lewo
    if (ChessMultiplayerComponent.isFieldEmpty(row, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldEmpty(row, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    if(!this.isMovedAlready){
      let longCastlePossible = true;
      for (let i = col - 1; i > 0; --i) {
        if (!ChessMultiplayerComponent.isFieldEmpty(row, i) || ChessMultiplayerComponent.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
          longCastlePossible = false;
          break;
        }
      }

      if (longCastlePossible && ChessMultiplayerComponent.getPieceByField(row, 0)) {
        let leftRook = ChessMultiplayerComponent.getPieceByField(row, 0);
        if (leftRook instanceof Rook) {
          if (!leftRook.isMovedAlready) {
            possiblePoints.push(new Point(row, col - 2));
          }
        }
      }

      let shortCastlePossible = true;
      for (let i = col + 1; i < 7; ++i) {
        if (!ChessMultiplayerComponent.isFieldEmpty(row, i) || ChessMultiplayerComponent.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
          shortCastlePossible = false;
          break;
        }
      }

      if (shortCastlePossible && ChessMultiplayerComponent.getPieceByField(row, 7)) {
        let rightRook = ChessMultiplayerComponent.getPieceByField(row, 7);
        if (rightRook instanceof Rook) {
          if (!rightRook.isMovedAlready) {
            possiblePoints.push(new Point(row, col + 2));
          }
        }
      }
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // lewo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // lewo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col - 1, this.color)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col + 1, this.color)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, this.color)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col, this.color)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }
}
