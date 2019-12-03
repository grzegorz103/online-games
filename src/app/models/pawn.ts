import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';
import { BoardComponent } from '../board/board.component';

export class Pawn extends Piece {

    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];
        let row = this.point.row;
        let col = this.point.col;
        if (this.color === Color.WHITE) {
            if (BoardComponent.isFieldEmpty(row - 1, col)) {
                possiblePoints.push(new Point(row - 1, col));

                if (BoardComponent.isFieldEmpty(row - 2, col)) {
                    possiblePoints.push(new Point(row - 2, col));
                }
            }
        } else {
            if (/*!BoardComponent.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ BoardComponent.isFieldEmpty(row + 1, col)) {
                possiblePoints.push(new Point(row + 1, col));

                if (BoardComponent.isFieldEmpty(row + 2, col)) {
                    possiblePoints.push(new Point(row + 2, col));
                }
            }
        }
        return possiblePoints;
    }

    checkMove(x: number, y: number) {
        if (this.color === Color.BLACK) {
            //    if(BoardComponent.is)
        } else {

        }
    }
}