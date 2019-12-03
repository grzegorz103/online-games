import { Point } from './point';
import { Color } from './color';

export abstract class Piece {
    point: Point;
    color: Color;
    image: string;

    constructor(point: Point, color: Color, image: string) {
        this.color = color;
        this.image = image;
        this.point = point;
    }

    abstract getPossibleMoves(): Point[];

    abstract getPossibleCaptures(): Point[];
}
