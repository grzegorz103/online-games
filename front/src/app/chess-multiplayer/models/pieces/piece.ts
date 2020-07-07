import {Point} from '../point';
import {Color} from './color';
import {AbstractPiece} from "./abstract-piece";

export abstract class Piece implements AbstractPiece {
  //   point: Point;
  color: Color;
  image: string;
  checkPoints: Point[] = [];
  relValue: number;
  unicode: string;

  constructor(color: Color, image: string, relValue: number, unicode: string) {
    this.color = color;
    this.image = image;
    //   this.point = point;
    this.relValue = relValue;
    this.unicode = unicode;
  }

  abstract getPossibleMoves(): Point[];

  abstract getPossibleCaptures(): Point[];

  abstract getCoveredFields(): Point[]; // zwraca liste punktow ktore sa puste lub istnieje na nich pionek tego samego koloru

}
