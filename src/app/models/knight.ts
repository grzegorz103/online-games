import { Piece } from './piece';
import { Point } from './point';
import { Color } from './color';
import { BoardComponent } from '../board/board.component';

export class Knight extends Piece {

    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        // gora -> lewo
        if (BoardComponent.isFieldEmpty(row - 2, col - 1)) {
            possiblePoints.push(new Point(row - 2, col - 1));
        }

        // gora -> prawo
        if (BoardComponent.isFieldEmpty(row - 2, col + 1)) {
            possiblePoints.push(new Point(row - 2, col + 1));
        }

        // lewo -> gora
        if (BoardComponent.isFieldEmpty(row - 1, col - 2)) {
            possiblePoints.push(new Point(row - 1, col - 2));
        }

        // prawo -> gora
        if (BoardComponent.isFieldEmpty(row - 1, col + 2)) {
            possiblePoints.push(new Point(row - 1, col + 2));
        }

        // lewo -> dol
        if (BoardComponent.isFieldEmpty(row - 1, col + 2)) {
            possiblePoints.push(new Point(row - 1, col + 2));
        }

        return possiblePoints;
    }

}