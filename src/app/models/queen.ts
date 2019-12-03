import { Piece } from './piece';
import { Point } from './point';
import { Color } from './color';

export class Queen extends Piece {
    
    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }
    
    getPossibleMoves(): import("./point").Point[] {
        throw new Error("Method not implemented.");
    }

}