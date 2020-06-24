import { Piece } from './piece';
import { Point } from './point';
import { Color } from './color';
import { ChessMultiplayerComponent} from "../chess-multiplayer.component";
import { King } from './king';

export class Queen extends Piece {

    constructor( color: Color, image: string) {
        super(color, image, 9);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

      let point = ChessMultiplayerComponent.getPointByPiece(this);

      let row = point.row;
      let col = point.col;

        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            } else {
                break;
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            } else {
                break;
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            } else {
                break;
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            } else {
                break;
            }
        }

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

        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
            if (ChessMultiplayerComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                break;
            } else {
                if (!ChessMultiplayerComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }
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
                if (!(ChessMultiplayerComponent.getPointByCoords(i,col).piece instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (ChessMultiplayerComponent.isFieldEmpty(i, col)){
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
            } else {
                if (!(ChessMultiplayerComponent.getPointByCoords(i,col).piece instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, col));
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (ChessMultiplayerComponent.isFieldEmpty(row, j)){
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
            } else {
                if (!(ChessMultiplayerComponent.getPointByCoords(row,j).piece instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (ChessMultiplayerComponent.isFieldEmpty(row, j)){
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
            } else {
                if (!(ChessMultiplayerComponent.getPointByCoords(row,col).piece instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, j));
                    break;
                }
            }
        }


        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j))
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            else {
                if (!(ChessMultiplayerComponent.getPointByCoords(i, j) instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                    break;
                }
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j))
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            else {
                if (!(ChessMultiplayerComponent.getPointByCoords(i, j) instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                    break;
                }
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j))
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            else {
                if (!(ChessMultiplayerComponent.getPointByCoords(i, j) instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                    break;
                }
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
            if (ChessMultiplayerComponent.isFieldEmpty(i, j))
                possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
            else {
                if (!(ChessMultiplayerComponent.getPointByCoords(i, j) instanceof King)) {
                    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(i, j));
                    break;
                }
            }
        }

        return possiblePoints;
    }

}
