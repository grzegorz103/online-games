import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {BoardComponent} from '../board/board.component';
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
    if (BoardComponent.isFieldEmpty(row, col - 1) && !BoardComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (BoardComponent.isFieldEmpty(row, col + 1) && !BoardComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (BoardComponent.isFieldEmpty(row + 1, col) && !BoardComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (BoardComponent.isFieldEmpty(row - 1, col) && !BoardComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (BoardComponent.isFieldEmpty(row - 1, col - 1) && !BoardComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (BoardComponent.isFieldEmpty(row - 1, col + 1) && !BoardComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (BoardComponent.isFieldEmpty(row + 1, col - 1) && !BoardComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (BoardComponent.isFieldEmpty(row + 1, col + 1) && !BoardComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    let longCastlePossible = true;
    for (let i = col - 1; i > 0; --i) {
      if (!BoardComponent.isFieldEmpty(row, i)) {
        longCastlePossible = false;
        break;
      }
    }

    if (longCastlePossible && BoardComponent.getPieceByField(row, 0)) {
      let leftRook = BoardComponent.getPieceByField(row, 0);
      if (leftRook instanceof Rook) {
        if (!leftRook.isMovedAlready) {
          possiblePoints.push(new Point(row, col - 2));
        }
      }
    }

    let shortCastlePossible = true;
    for (let i = col + 1; i < 7; ++i) {
      if (!BoardComponent.isFieldEmpty(row, i)) {
        shortCastlePossible = false;
        break;
      }
    }

    if (shortCastlePossible && BoardComponent.getPieceByField(row, 7)) {
      let rightRook = BoardComponent.getPieceByField(row, 7);
      if (rightRook instanceof Rook) {
        if (!rightRook.isMovedAlready) {
          possiblePoints.push(new Point(row, col + 2));
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
    if (BoardComponent.isFieldTakenByEnemy(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (BoardComponent.isFieldTakenByEnemy(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let row = this.point.row;
    let col = this.point.col;

    // lewo
    if (BoardComponent.isFieldTakenByEnemy(row, col - 1, this.color)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (BoardComponent.isFieldTakenByEnemy(row, col + 1, this.color)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col, this.color)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col, this.color)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }
}
