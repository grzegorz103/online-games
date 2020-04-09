import { Piece } from './piece';
import { Point } from './point';
import { Color } from './color';
import { BoardComponent } from '../board/board.component';
import { King } from './king';

export class Queen extends Piece {

    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }
    
    getPossibleMoves(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
            if (BoardComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
            if (BoardComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
            if (BoardComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
            if (BoardComponent.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            } else {
                break;
            }
        }

        for (let i = row + 1; i < 8; ++i) { // dol
            if (BoardComponent.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            } else {
                break;
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (BoardComponent.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            } else {
                break;
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (BoardComponent.isFieldEmpty(row, j)) {
                possiblePoints.push(new Point(row, j));
            } else {
                break;
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (BoardComponent.isFieldEmpty(row, j)) {
                possiblePoints.push(new Point(row, j));
            } else {
                break;
            }
        }

        return possiblePoints;
    }

    getPossibleCaptures(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
            if (BoardComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
            if (BoardComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
            if (BoardComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
            if (BoardComponent.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, j));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(i, j)) {
                    break;
                }
            }
        }
        for (let i = row + 1; i < 8; ++i) { // dol
            if (BoardComponent.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, col));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(i, col)) {
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (BoardComponent.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(i, col));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(i, col)) {
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (BoardComponent.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row,j));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(row,j)) {
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (BoardComponent.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row, j));
                break;
            } else {
                if (!BoardComponent.isFieldEmpty(row, j)) {
                    break;
                }
            }
        }
        return possiblePoints;
    }

    getCoveredFields(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;
        
        for (let i = row + 1; i < 8; ++i) { // dol
            if (BoardComponent.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            } else {
                if (!(BoardComponent.getPieceByField(i,col) instanceof King)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
            }
        }

        for (let i = row - 1; i >= 0; --i) { // gora
            if (BoardComponent.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            } else {
                if (!(BoardComponent.getPieceByField(i,col) instanceof King)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
            }
        }

        for (let j = col - 1; j >= 0; --j) { // lewo
            if (BoardComponent.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            } else {
                if (!(BoardComponent.getPieceByField(row,j)instanceof King)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
            }
        }

        for (let j = col + 1; j < 8; ++j) { // prawo
            if (BoardComponent.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            } else {
                if (!(BoardComponent.getPieceByField(row,j) instanceof King)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
            }
        }


        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
            if (BoardComponent.isFieldEmpty(i, j))
                possiblePoints.push(new Point(i, j));
            else {
                if (!(BoardComponent.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
            }
        }

        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
            if (BoardComponent.isFieldEmpty(i, j))
                possiblePoints.push(new Point(i, j));
            else {
                if (!(BoardComponent.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
            }
        }

        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
            if (BoardComponent.isFieldEmpty(i, j))
                possiblePoints.push(new Point(i, j));
            else {
                if (!(BoardComponent.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
            }
        }

        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
            if (BoardComponent.isFieldEmpty(i, j))
                possiblePoints.push(new Point(i, j));
            else {
                if (!(BoardComponent.getPieceByField(i, j) instanceof King)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
            }
        }

        return possiblePoints;
    }
 
}