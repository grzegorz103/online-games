import {Point} from "../point";

export interface AbstractPiece {

   getPossibleMoves(): Point[];

   getPossibleCaptures(): Point[];

}
