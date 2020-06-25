import {Piece} from './piece';
import {Point} from './point';
import {Color} from './color';
import {ChessMultiplayerComponent} from "../chess-multiplayer.component";

export class Knight extends Piece {

  isMovedAlready = false;

  constructor(color: Color, image: string) {
    super(color, image, 3);
  }

  getPossibleMoves(): Point[] {
    let possiblePoints = [];

    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    // gora -> lewo
    if (ChessMultiplayerComponent.isFieldEmpty(row - 2, col - 1)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col - 1));
    }

    // gora -> prawo
    if (ChessMultiplayerComponent.isFieldEmpty(row - 2, col + 1)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col + 1));
    }

    // lewo -> gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col - 2)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 2));
    }

    // prawo -> gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col + 2)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 2));
    }

    // lewo -> dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col - 2)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 2));
    }

    // prawo -> dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col + 2)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 2));
    }

    // dol -> lewo
    if (ChessMultiplayerComponent.isFieldEmpty(row + 2, col - 1)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col - 1));
    }

    // dol -> prawo
    if (ChessMultiplayerComponent.isFieldEmpty(row + 2, col + 1)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col + 1));
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    let possiblePoints = [];

    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    // gora -> lewo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col - 1));
    }

    // gora -> prawo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col + 1));
    }

    // lewo -> gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 2));
    }

    // prawo -> gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 2));
    }

    // lewo -> dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 2));
    }

    // prawo -> dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 2));
    }

    // dol -> lewo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col - 1));
    }

    // dol -> prawo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col + 1));
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    let possiblePoints = [];

    let point = ChessMultiplayerComponent.getPointByPiece(this);

    let row = point.row;
    let col = point.col;

    // gora -> lewo
    if (ChessMultiplayerComponent.getPointByCoords(row - 2, col - 1)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col - 1));
    }


    // gora -> prawo
    if(ChessMultiplayerComponent.getPointByCoords(row - 2, col + 1))
    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 2, col + 1));

    // lewo -> gora

    if(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 2) )
    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 2));

    // prawo -> gora
    if(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 2))
    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 2));

    // lewo -> dol
    if(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 2))
    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 2));

    // prawo -> dol
    if(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 2))
    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 2));

    // dol -> lewo
    if(ChessMultiplayerComponent.getPointByCoords(row + 2, col - 1))
    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col - 1));


    // dol -> prawo
    if(ChessMultiplayerComponent.getPointByCoords(row + 2, col + 1))
    possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 2, col + 1));


    return possiblePoints;
  }
}
