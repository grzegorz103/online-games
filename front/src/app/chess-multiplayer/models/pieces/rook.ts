import { Piece } from './piece';
import { Color } from './color';
import { Point } from '../point';
import { ChessMultiplayerComponent} from "../../chess-multiplayer.component";
import { King } from './king';

export class Rook extends Piece {

  isMovedAlready = false;

  constructor( color: Color, image: string) {
        super( color, image, 5);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

      let point = ChessMultiplayerComponent.getPointByPiece(this);

      let row = point.row;
      let col = point.col;

        for (let i = row + 1; i < 8; ++i) { // dol
            if (ChessMultiplayerComponent.isFieldEmpty(i, col)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
            } else {
                break;
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (ChessMultiplayerComponent.isFieldEmpty(i, col)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
            } else {
                break;
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (ChessMultiplayerComponent.isFieldEmpty(row, j)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
            } else {
                break;
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (ChessMultiplayerComponent.isFieldEmpty(row, j)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
            } else {
                break;
            }
        }

        return possiblePoints;
    }

    getPossibleCaptures(): Point[] {
        let possiblePoints = [];

      let point = ChessMultiplayerComponent.getPointByPiece(this);

      let row = point.row;
      let col = point.col;

        for (let i = row + 1; i < 8; ++i) { // dol
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(i, col)) {
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(i, col)) {
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row,j));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(row,j)) {
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(row, j)) {
                    break;
                }
            }
        }

        return possiblePoints;
    }


    getCoveredFields(): Point[] {
        let possiblePoints = [];

      let point = ChessMultiplayerComponent.getPointByPiece(this);

      let row = point.row;
      let col = point.col;

        for (let i = row + 1; i < 8; ++i) { // dol
            if (ChessMultiplayerComponent.isFieldEmpty(i, col)){
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
            } else {
                if (!(ChessMultiplayerComponent.getPointByCoords instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (ChessMultiplayerComponent.isFieldEmpty(i, col)){
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
            } else {
                if (!(ChessMultiplayerComponent.getPointByCoords instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (ChessMultiplayerComponent.isFieldEmpty(row, j)){
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
            } else {
                if (!(ChessMultiplayerComponent.getPointByCoords instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (ChessMultiplayerComponent.isFieldEmpty(row, j)){
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
            } else {
                if (!(ChessMultiplayerComponent.getPointByCoords instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
                    break;
                }
            }
        }

        return possiblePoints;
    }

}
