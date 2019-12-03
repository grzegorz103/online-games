import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';
import { BoardComponent } from '../board/board.component';

export class King extends Piece {

    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        // lewo
        if (BoardComponent.isFieldEmpty(row, col - 1)) {
            possiblePoints.push(new Point(row, col - 1));
        }

        // prawo
        if (BoardComponent.isFieldEmpty(row, col + 1)) {
            possiblePoints.push(new Point(row, col + 1));
        }

        // dol
        if (BoardComponent.isFieldEmpty(row + 1, col)) {
            possiblePoints.push(new Point(row + 1, col));
        }

        // gora
        if (BoardComponent.isFieldEmpty(row - 1, col)) {
            possiblePoints.push(new Point(row - 1, col));
        }

        // lewo gora
        if (BoardComponent.isFieldEmpty(row - 1, col - 1)) {
            possiblePoints.push(new Point(row - 1, col - 1));
        }
        // prawo gora
        if (BoardComponent.isFieldEmpty(row - 1, col + 1)) {
            possiblePoints.push(new Point(row - 1, col + 1));
        }

        // lewo dol
        if (BoardComponent.isFieldEmpty(row + 1, col - 1)) {
            possiblePoints.push(new Point(row + 1, col - 1));
        }
        // prawo dol
        if (BoardComponent.isFieldEmpty(row + 1, col + 1)) {
            possiblePoints.push(new Point(row + 1, col + 1));
        }
        return possiblePoints;
    }

    getPossibleCaptures(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        // lewo
        if (BoardComponent.isFieldTakenByEnemy(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row, col - 1));
        }

        // prawo
        if (BoardComponent.isFieldTakenByEnemy(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row, col + 1));
        }

        // dol
        if (BoardComponent.isFieldTakenByEnemy(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row + 1, col));
        }

        // gora
        if (BoardComponent.isFieldTakenByEnemy(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row - 1, col));
        }

        // lewo gora
        if (BoardComponent.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row - 1, col - 1));
        }
        // prawo gora
        if (BoardComponent.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row - 1, col + 1));
        }

        // lewo dol
        if (BoardComponent.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row + 1, col - 1));
        }
        // prawo dol
        if (BoardComponent.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
            possiblePoints.push(new Point(row + 1, col + 1));
        }
        
        return possiblePoints;
    }

}