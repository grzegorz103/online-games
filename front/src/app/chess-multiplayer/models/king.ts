import {Piece} from './piece';
import {Color} from './color';
import {Point} from './point';
import {ChessMultiplayerComponent} from "../chess-multiplayer.component";
import {Rook} from "./rook";

export class King extends Piece {

  castledAlready = false;
  shortCastled = false;
  longCastled = false;
  isMovedAlready = false;
  isCastling = false;

  constructor(color: Color, image: string) {
    super(color, image, 0);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    // lewo
    if (ChessMultiplayerComponent.isFieldEmpty(row, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldEmpty(row, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
    }

    if (!this.isMovedAlready) {
      let longCastlePossible = true;
      for (let i = col - 1; i > 0; --i) {
        if (!ChessMultiplayerComponent.isFieldEmpty(row, i) || ChessMultiplayerComponent.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
          longCastlePossible = false;
          break;
        }
      }

      if (longCastlePossible && ChessMultiplayerComponent.getPointByCoords(row, 0)) {
        let leftRookPoint = ChessMultiplayerComponent.getPointByCoords(row, 0);
        if (leftRookPoint && leftRookPoint.piece instanceof Rook) {
          if (!leftRookPoint.piece.isMovedAlready) {
            possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col - 2));
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

      if (shortCastlePossible && ChessMultiplayerComponent.getPointByCoords(row, 7)) {
        let rightRookPoint = ChessMultiplayerComponent.getPointByCoords(row, 7);
        if (rightRookPoint && rightRookPoint.piece instanceof Rook) {
          if (!rightRookPoint.piece.isMovedAlready) {
            possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col + 2));
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

    // lewo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    // lewo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col - 1, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col + 1, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
    }

    return possiblePoints;
  }
}
