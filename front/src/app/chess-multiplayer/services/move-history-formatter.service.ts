import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoveHistoryFormatterService {

  constructor() {
  }

  format(move: string): string {
    return move.replace('/[a-z]', '3');
  }
}
