import {Piece} from "./pieces/piece";

export class Point {
    row: number;
    col: number;
    piece: Piece;
    pointChar: string;

    constructor(row: number, col: number, pointChar, piece: Piece) {
        this.row = row;
        this.col = col;
        this.pointChar = pointChar;
        this.piece = piece;
    }
}

