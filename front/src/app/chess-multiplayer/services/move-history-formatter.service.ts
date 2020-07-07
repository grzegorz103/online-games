import {Injectable} from '@angular/core';
import {Piece} from "../models/pieces/piece";

@Injectable({
  providedIn: 'root'
})
export class MoveHistoryFormatterService {

  constructor() {
  }

  format(move: string, piece: Piece): string {
    return piece.unicode + move.substring(2, 4);
  }

}
