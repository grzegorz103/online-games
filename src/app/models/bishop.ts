import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';
import { BoardComponent } from '../board/board.component';

export class Bishop extends Piece {

    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        if (this.color === Color.WHITE) {
            for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) { // lewa gorna przekatna
                if (!BoardComponent.isFieldTakenByEnemy(i, j, Color.BLACK) && BoardComponent.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                } else {
                    break;
                }
            }

            for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) { // prawa gorna przekatna
                if (!BoardComponent.isFieldTakenByEnemy(i, j, Color.BLACK) && BoardComponent.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                } else {
                    break;
                }
            }

            for (let i = row + 1, j = col -1; i < 8 && j >= 0; ++i, --j) { // lewa dolna przekatna
                if (!BoardComponent.isFieldTakenByEnemy(i, j, Color.BLACK) && BoardComponent.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                } else {
                    break;
                }
            }

            for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) { // prawa dolna przekatna
                if (!BoardComponent.isFieldTakenByEnemy(i, j, Color.BLACK) && BoardComponent.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                } else {
                    break;
                }
            }
        } else {

        }
        return possiblePoints;
    }

}