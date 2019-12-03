import { Piece } from './piece';

export class Queen extends Piece {
    getPossibleMoves(): import("./point").Point[] {
        throw new Error("Method not implemented.");
    }

}