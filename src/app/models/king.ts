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

       
        return possiblePoints;
    }

}