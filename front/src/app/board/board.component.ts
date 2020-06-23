import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Point} from '../models/point';
import {Piece} from '../models/piece';
import {Pawn} from '../models/pawn';
import {Color} from '../models/color';
import {Rook} from '../models/rook';
import {Bishop} from '../models/bishop';
import {Knight} from '../models/knight';
import {Queen} from '../models/queen';
import {King} from '../models/king';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  aspectRatio = true;

  model = {
    left: true,
    middle: false,
    right: false
  };
  startX: any;
  startY: any;
  activePiece: Piece;

  // private blackPieceThatGivesCheck: Piece;
  board: number[][];
  static pieces: Piece[];
  possibleMoves: Point[];
  possibleCaptures: Point[];

  mouseX: number;
  mouseY: number;

  selected: boolean = false;

  blackKingChecked = false;
  whiteKingChecked = false;

  @ViewChild('dragRef', {static: false}) boardRef: ElementRef;

  constructor() {
    this.board = [];
    this.possibleMoves = [];
    this.possibleCaptures = [];

    for (var i: number = 0; i < 8; ++i) {
      this.board[i] = [];
      for (var j: number = 0; j < 8; ++j) {
        this.board[i][j] = 0;
      }
    }

    this.addPieces();
  }

  ngOnInit() {
  }

  addPieces() {
    BoardComponent.pieces = [];

    // piony czarne
    for (let i = 0; i < 8; ++i) {
      BoardComponent.pieces.push(new Pawn(new Point(1, i), Color.BLACK, 'pawn-black.png'));
    }
    BoardComponent.pieces.push(new Rook(new Point(0, 0), Color.BLACK, 'rook-black.jpg'));
    BoardComponent.pieces.push(new Knight(new Point(0, 1), Color.BLACK, 'knight-black.png'));
    BoardComponent.pieces.push(new Bishop(new Point(0, 2), Color.BLACK, 'bishop-black.png'));
    BoardComponent.pieces.push(new Queen(new Point(0, 3), Color.BLACK, 'queen-black.png'));
    BoardComponent.pieces.push(new King(new Point(0, 4), Color.BLACK, 'king-black.png'));
    BoardComponent.pieces.push(new Bishop(new Point(0, 5), Color.BLACK, 'bishop-black.png'));
    BoardComponent.pieces.push(new Knight(new Point(0, 6), Color.BLACK, 'knight-black.png'));
    BoardComponent.pieces.push(new Rook(new Point(0, 7), Color.BLACK, 'rook-black.jpg'));


    // piony biale
    for (let i = 0; i < 8; ++i) {
      BoardComponent.pieces.push(new Pawn(new Point(6, i), Color.WHITE, 'pawn-white.png'));
    }
    BoardComponent.pieces.push(new Rook(new Point(7, 0), Color.WHITE, 'rook-white.png'));
    BoardComponent.pieces.push(new Knight(new Point(7, 1), Color.WHITE, 'knight-white.png'));
    BoardComponent.pieces.push(new Bishop(new Point(7, 2), Color.WHITE, 'bishop-white.png'));
    BoardComponent.pieces.push(new Queen(new Point(7, 3), Color.WHITE, 'queen-white.png'));
    BoardComponent.pieces.push(new King(new Point(7, 4), Color.WHITE, 'king-white.png'));
    BoardComponent.pieces.push(new Bishop(new Point(7, 5), Color.WHITE, 'bishop-white.png'));
    BoardComponent.pieces.push(new Knight(new Point(7, 6), Color.WHITE, 'knight-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 7), Color.WHITE, 'rook-white.png'));
  }

  getPieceByPoint(row: number, col: number): Piece {
    row = Math.floor(row);
    col = Math.floor(col);
    return BoardComponent.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  getPointByCoordinates(row: number, col: number): Point {
    row = Math.floor(row);
    col = Math.floor(col);

    return BoardComponent.pieces.find(e => e.point.col === col && e.point.row).point;
  }

  onMouseDown(event) {
    let pointClicked = this.getClickPoint(event);

    if (this.selected) {
      //   this.possibleMoves = activePiece.getPossibleMoves();
      if (this.isPointInPossibleMoves(pointClicked) || this.isPointInPossibleCaptures(pointClicked)) {
        this.movePiece(this.activePiece, pointClicked);
        if (this.isKingInCheck(Color.BLACK, BoardComponent.pieces)) {
          this.blackKingChecked = true;
        } else {
          this.blackKingChecked = false;
        }
        this.computerMove();
      }
      this.selected = false;
      this.possibleCaptures = [];
      this.possibleMoves = [];
    } else {
      let pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
      if (pieceClicked) {

        if (pieceClicked.color === Color.BLACK) {
          return;
        }
        if (this.whiteKingChecked && (pieceClicked instanceof King)) {
          this.activePiece = pieceClicked;
          this.selected = true;
          this.possibleCaptures = this.getPossibleCapturesForKingInCheck(Color.WHITE).filter(e => !this.willMoveCauseCheck(Color.WHITE,pieceClicked.point.row, pieceClicked.point.col, e.row, e.col));
          this.possibleMoves = this.getPossibleMovesForKingInCheck(Color.WHITE).filter(e => !this.willMoveCauseCheck(Color.WHITE,pieceClicked.point.row, pieceClicked.point.col, e.row, e.col));
        } else if (!this.whiteKingChecked) {
          this.activePiece = pieceClicked;
          this.selected = true;
          console.log('ne ma');
          this.possibleCaptures = pieceClicked.getPossibleCaptures().filter(e => !this.willMoveCauseCheck(Color.WHITE,pieceClicked.point.row, pieceClicked.point.col, e.row, e.col));
          this.possibleMoves = pieceClicked.getPossibleMoves().filter(e => !this.willMoveCauseCheck(Color.WHITE,pieceClicked.point.row, pieceClicked.point.col, e.row, e.col));
        } else if (this.whiteKingChecked && !(pieceClicked instanceof King)) {
          this.activePiece = pieceClicked;
          this.possibleMoves = this.getPossibleMovesForKingInCheck2()
          //    this.getCrossedMoves(this.activePiece.getPossibleMoves());
          this.selected = true;
          this.possibleCaptures = this.getPossibleCapturesForKingInCheck2();
          // tylko te ruchy, ktore moga zablokowac szach
          // this.activePiece = pieceClicked;
          // this.selected = true;
          // this.possibleCaptures = pieceClicked.getPossibleCaptures().filter(e => !BoardComponent.isFieldUnderAttack(e.row, e.col, Color.BLACK));
          // this.possibleMoves = pieceClicked.getPossibleMoves().filter(e => !BoardComponent.isFieldUnderAttack(e.row, e.col, Color.BLACK));
        }
      }
    }
  }

  public willMoveCauseCheck(currentColor: Color,row: number, col: number, destRow: number, destCol: number) {
    let tempBoard = BoardComponent.pieces;
    /*  BoardComponent.pieces = BoardComponent.pieces.filter(piece =>
        (piece.point.col !== col) || (piece.point.row !== row)
      );*/
    let srcPiece = BoardComponent.getPieceByField(row, col);
    if (srcPiece) {
      if (srcPiece) {
        srcPiece.point.row = destRow;
        srcPiece.point.col = destCol;
      }
    }
    let isBound = this.isKingInCheck(currentColor, BoardComponent.pieces);
    //let isBound = this.isKingInCheck(Color.WHITE, BoardComponent.pieces) && this.canPieceThatGivesCheckBeCaptured(pieceClicked);
//    BoardComponent.pieces = tempBoard;

    if (srcPiece) {
      srcPiece.point.col = col;
      srcPiece.point.row = row;
    }
    return isBound;
  }


  private isPieceBound(pieceClicked: Piece) {
    if (pieceClicked instanceof King) {
      return;
    }
    let c, d;
    //   if (this.blackPieceThatGivesCheck) {
    //    c = this.getPossibleCapturesForKingInCheck2().length === 0;
    //    console.log(c + " CC");
    //    d = this.getPossibleMovesForKingInCheck2().length === 0;
    //    console.log(d + " DD")
    //   }

    let tempBoard = BoardComponent.pieces;
    BoardComponent.pieces = BoardComponent.pieces.filter(piece =>
      (piece.point.col !== pieceClicked.point.col) || (piece.point.row !== pieceClicked.point.row)
    );


    let isBound = this.isKingInCheck(Color.WHITE, BoardComponent.pieces);
    console.log(isBound + " EE");
    //let isBound = this.isKingInCheck(Color.WHITE, BoardComponent.pieces) && this.canPieceThatGivesCheckBeCaptured(pieceClicked);
    BoardComponent.pieces = tempBoard;
    return isBound;
  }

  getPossibleMovesForKingInCheck2() {
    let currentActivePiecePoint = this.activePiece.point;
    let tempPossibleMoves = [];
    this.activePiece.getPossibleMoves().forEach(piece => {
      this.activePiece.point = piece;
      if (!this.isKingInCheck(Color.WHITE, BoardComponent.pieces)) {
        tempPossibleMoves.push(this.activePiece.point);
      }
    });
    console.log(tempPossibleMoves);
    this.activePiece.point = currentActivePiecePoint;

    return tempPossibleMoves;
  }


  getPossibleCapturesForKingInCheck2() {
    let currentActivePiecePoint = this.activePiece.point;
    let tempPossibleCaptures = [];
    this.activePiece.getPossibleCaptures().forEach(piece => {
      let removedPiece = BoardComponent.getPieceByField(piece.row, piece.col);
      console.log(removedPiece);
      let removedPiecePoint = removedPiece.point;
      removedPiece.point = new Point(-1, -1);
      this.activePiece.point = piece;
      if (!this.isKingInCheck(Color.WHITE, BoardComponent.pieces)) {
        tempPossibleCaptures.push(this.activePiece.point);
      }
      removedPiece.point = removedPiecePoint;
    });
    this.activePiece.point = currentActivePiecePoint;

    return tempPossibleCaptures;
  }


  static isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return BoardComponent.pieces.some(e => e.point.col === col && e.point.row === row && e.color === enemyColor);
  }

  static isFieldEmpty(row: number, col: number): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return !BoardComponent.pieces.some(e => e.point.col === col && e.point.row === row);
  }

  getClickPoint(event) {
    return new Point(
      Math.floor((event.y - this.boardRef.nativeElement.getBoundingClientRect().top) / (this.boardRef.nativeElement.getBoundingClientRect().height / 8)),
      Math.floor((event.x - this.boardRef.nativeElement.getBoundingClientRect().left) / (this.boardRef.nativeElement.getBoundingClientRect().width / 8)));
  }

  /*   onMouseUp(event) {
      let xPos = event.x - this.boardRef.nativeElement.getBoundingClientRect().left;
      let yPos = event.y - this.boardRef.nativeElement.getBoundingClientRect().top;
      let boardHeight = this.boardRef.nativeElement.getBoundingClientRect().height;
      let boardWidth = this.boardRef.nativeElement.getBoundingClientRect().width;

      xPos = Math.floor(xPos / (boardWidth / 8));
      yPos = Math.floor(yPos / (boardHeight / 8));

      if (xPos === this.startX && yPos === this.startY) {
        console.log('d'); let piece = this.getPieceByPoint(yPos, xPos);
        if (piece === null) return;
        this.pieces.delete(this.getPointByCoordinates(yPos, xPos));
        this.pieces.set(new Point(yPos, xPos), piece);
        return;
      }
      this.movePiece(this.startX, this.startY, xPos, yPos);
    } */

  movePiece(piece: Piece, newPoint: Point) {
    let destPiece = BoardComponent.pieces.find(e => e.point.col === newPoint.col && e.point.row === newPoint.row);

    if (destPiece && piece.color != destPiece.color) {
      BoardComponent.pieces = BoardComponent.pieces.filter(e => e !== destPiece);
    } else if (destPiece && piece.color === destPiece.color) {
      return;
    }

    if (piece instanceof King) {
      let squaresMoved = Math.abs(newPoint.col - piece.point.col);
      if (squaresMoved > 1) {
        if (newPoint.col < 3) {
          let leftRook = BoardComponent.getPieceByField(piece.point.row, 0);
          leftRook.point.col = 3;
        } else {
          let rightRook = BoardComponent.getPieceByField(piece.point.row, 7);
          rightRook.point.col = 5;
        }
      }
    }
    piece.point = newPoint;
    this.checkForPawnPromote(piece);
    this.checkIfPawnFirstMove(piece);
    this.checkIfRookMoved(piece);
    this.checkIfKingMoved(piece);
    // BoardComponent.pieces.push(piece);
    //    BoardComponent.pieces.delete(this.getPointByCoordinates(ySource, xSource));
    //  BoardComponent.pieces.set(new Point(yDest, xDest), piece);
  }


  isPointInPossibleMoves(point: Point): boolean {
    return this.possibleMoves.some(e => e.row === point.row && e.col === point.col);
  }

  isPointInPossibleCaptures(point: Point): boolean {
    return this.possibleCaptures.some(e => e.row === point.row && e.col === point.col);
  }

  isXYInPossibleMoves(row: number, col: number): boolean {
    return this.possibleMoves.some(e => e.row === row && e.col === col);
  }

  isXYInPossibleCaptures(row: number, col: number): boolean {
    return this.possibleCaptures.some(e => e.row === row && e.col === col);
  }

  checkIfPawnFirstMove(piece: Piece) {
    if (piece instanceof Pawn) {
      (piece as Pawn).isMovedAlready = true;
    }
  }

  computerMove() {
    //if (this.isKingInCheck(Color.BLACK)) {

    // }

    let blackPieces = BoardComponent.pieces
      .filter(e => e.color === Color.BLACK)
      .filter(e => e.getPossibleMoves().filter(f => !this.willMoveCauseCheck(Color.BLACK,e.point.row, e.point.col, f.row, f.col)).length > 0
        || e.getPossibleCaptures().filter(f => !this.willMoveCauseCheck(Color.BLACK,e.point.row, e.point.col, f.row, f.col)).length > 0);

    if (blackPieces.length > 0) {
      let randomPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
      let possibleCaptures = randomPiece.getPossibleCaptures().filter(e => !this.willMoveCauseCheck(Color.BLACK,randomPiece.point.row, randomPiece.point.col, e.row, e.col));
      let possibleMoves = randomPiece.getPossibleMoves().filter(e => !this.willMoveCauseCheck(Color.BLACK,randomPiece.point.row, randomPiece.point.col, e.row, e.col));
      if (possibleCaptures.length > 0) {
        this.movePiece(randomPiece, possibleCaptures[Math.floor(Math.random() * possibleCaptures.length)]);
      } else if (possibleMoves.length > 0) {
        this.movePiece(randomPiece, possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
      }

      if (this.isKingInCheck(Color.WHITE, BoardComponent.pieces)) {
        this.whiteKingChecked = true;
        //   this.blackPieceThatGivesCheck = randomPiece;
      } else {
        this.whiteKingChecked = false;
      }
    }
  }

  isKingInCheck(color: Color, piece: Piece[]): boolean {
    let king = piece
      .find(e => e.color === color && e instanceof King);

    if (king) {
      return piece.some(e => e.getPossibleCaptures().some(e => e.col === king.point.col && e.row === king.point.row) && e.color !== color);
    }
    return false;
  }

  isKingChecked(piece: Piece) {
    if (piece instanceof King) {
      return piece.color === Color.WHITE ? this.whiteKingChecked : this.blackKingChecked;
    }
  }

  getPossibleCapturesForKingInCheck(color: Color) {
    let king = BoardComponent
      .pieces
      .find(e => e.color === color && e instanceof King);

    let possiblePoints = [];

    let row = king.point.row;
    let col = king.point.col;

    // lewo
    if (BoardComponent.isFieldTakenByEnemy(row, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (BoardComponent.isFieldTakenByEnemy(row, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row + 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row - 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row - 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (BoardComponent.isFieldTakenByEnemy(row - 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row - 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row + 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (BoardComponent.isFieldTakenByEnemy(row + 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !BoardComponent.isFieldUnderAttack(row + 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }

  //czy jest pod biciem
  static isFieldUnderAttack(row: number, col: number, color: Color) {
    let found = false;
    return BoardComponent.pieces.filter(e => e.color === color).some(e => e.getCoveredFields().some(f => f.col === col && f.row === row));

  }

  getPossibleMovesForKingInCheck(color: Color) {
    let king = BoardComponent
      .pieces
      .find(e => e.color === color && e instanceof King);

    let possiblePoints = [];

    let row = king.point.row;
    let col = king.point.col;

    // lewo
    if (BoardComponent.isFieldEmpty(row, col - 1) && !BoardComponent.isFieldUnderAttack(row, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col - 1));
    }

    // prawo
    if (BoardComponent.isFieldEmpty(row, col + 1) && !BoardComponent.isFieldUnderAttack(row, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row, col + 1));
    }

    // dol
    if (BoardComponent.isFieldEmpty(row + 1, col) && !BoardComponent.isFieldUnderAttack(row + 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col));
    }

    // gora
    if (BoardComponent.isFieldEmpty(row - 1, col) && !BoardComponent.isFieldUnderAttack(row - 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col));
    }

    // lewo gora
    if (BoardComponent.isFieldEmpty(row - 1, col - 1) && !BoardComponent.isFieldUnderAttack(row - 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col - 1));
    }
    // prawo gora
    if (BoardComponent.isFieldEmpty(row - 1, col + 1) && !BoardComponent.isFieldUnderAttack(row - 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row - 1, col + 1));
    }

    // lewo dol
    if (BoardComponent.isFieldEmpty(row + 1, col - 1) && !BoardComponent.isFieldUnderAttack(row + 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col - 1));
    }
    // prawo dol
    if (BoardComponent.isFieldEmpty(row + 1, col + 1) && !BoardComponent.isFieldUnderAttack(row + 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(new Point(row + 1, col + 1));
    }
    return possiblePoints;
  }

  static getPieceByField(row: number, col: number): Piece {
    if (BoardComponent.isFieldEmpty(row, col)) {
      //   throw new Error('Piece not found');
      return undefined;
    }

    return BoardComponent.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  checkForPawnPromote(piece: Piece) {
    if (!(piece instanceof Pawn)) {
      return;
    }

    if (piece.color === Color.WHITE && piece.point.row === 0) {
      BoardComponent.pieces = BoardComponent.pieces.filter(e => e !== piece);
      BoardComponent.pieces.push(new Queen(piece.point, Color.WHITE, 'queen-white.png'));
    } else if (piece.color === Color.BLACK && piece.point.row === 7) {
      BoardComponent.pieces = BoardComponent.pieces.filter(e => e !== piece);
      BoardComponent.pieces.push(new Queen(piece.point, Color.BLACK, 'queen-black.png'));
    }
  }

  private checkIfRookMoved(piece: Piece) {
    if (piece instanceof Rook) {
      piece.isMovedAlready = true;
    }
  }

  private checkIfKingMoved(piece: Piece) {
    if (piece instanceof King) {
      piece.isMovedAlready = true;
    }
  }
}
