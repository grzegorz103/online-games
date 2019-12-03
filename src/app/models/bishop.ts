import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';

export class Bishop extends Piece {
    
    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }
    getPossibleMoves(): import("./point").Point[] {
        throw new Error("Method not implemented.");
    }

}