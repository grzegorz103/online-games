import {Injectable} from '@angular/core';
import {Piece} from "../models/pieces/piece";
import {Queen} from "../models/pieces/queen";
import {Rook} from "../models/pieces/rook";
import {Bishop} from "../models/pieces/bishop";
import {Knight} from "../models/pieces/knight";
import {Color} from "../models/pieces/color";

@Injectable({
  providedIn: 'root'
})
export class PieceFactoryService {

  constructor() {
  }

  public getPiece(number: number, color: Color): Piece {
    let isWhite = color === Color.WHITE;
    switch (number) {
      case 1:
        return new Queen(color, isWhite ? 'queen-white.png' : 'queen-black.png');
      case 2:
        return new Rook(color, isWhite ? 'rook-white-png' : 'rook-black.png');
      case 3:
        return new Bishop(color, isWhite ? 'bishop-white.png' : 'bishop-black.png');
      case 4:
        return new Knight(color, isWhite ? 'knight-white.png' : 'knight-black.png');
      default:
        return new Queen(color, isWhite ? 'queen-white.png' : 'queen-black.png');
    }
  }

}
