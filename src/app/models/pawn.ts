import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';
import { BoardComponent } from '../board/board.component';

export class Pawn extends Piece {

    isMovedAlready = false;

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

                if (!this.isMovedAlready && BoardComponent.isFieldEmpty(row - 2, col)) {
                    possiblePoints.push(new Point(row - 2, col));
                }
            }
        } else {
            if (/*!BoardComponent.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ BoardComponent.isFieldEmpty(row + 1, col)) {
                possiblePoints.push(new Point(row + 1, col));

                if (!this.isMovedAlready && BoardComponent.isFieldEmpty(row + 2, col)) {
                    possiblePoints.push(new Point(row + 2, col));
                }
            }
        }
        return possiblePoints;
    }

    getPossibleCaptures(): Point[] {
        let possiblePoints = [];
        let row = this.point.row;
        let col = this.point.col;
        if (this.color === Color.WHITE) {
            if (BoardComponent.isFieldTakenByEnemy(row - 1, col - 1, Color.BLACK)) {
                possiblePoints.push(new Point(row - 1, col - 1));
            }
            if (BoardComponent.isFieldTakenByEnemy(row - 1, col + 1, Color.BLACK)) {
                possiblePoints.push(new Point(row - 1, col + 1));
            }
        } else {
            if (BoardComponent.isFieldTakenByEnemy(row + 1, col - 1, Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col - 1));
            }
            if (BoardComponent.isFieldTakenByEnemy(row + 1, col + 1, Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col + 1));
            }
        }

        return possiblePoints;
    }

    getCoveredFields(): Point[] {
        let possiblePoints = [];
        let row = this.point.row;
        let col = this.point.col;

        if (this.color === Color.WHITE) {

            possiblePoints.push(new Point(row - 1, col - 1));

            possiblePoints.push(new Point(row - 1, col + 1));
        } else {
            possiblePoints.push(new Point(row + 1, col - 1));

            possiblePoints.push(new Point(row + 1, col + 1));
        }
        return possiblePoints;
    }

}