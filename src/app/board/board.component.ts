import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Point } from '../models/point';
import { Piece } from '../models/piece';
import { Pawn } from '../models/pawn';
import { Color } from '../models/color';
import { Rook } from '../models/rook';
import { Bishop } from '../models/bishop';
import { Knight } from '../models/knight';
import { Queen } from '../models/queen';
import { King } from '../models/king';


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

  board: number[][];
  static pieces: Piece[];
  possibleMoves: Point[];
  possibleCaptures: Point[];

  mouseX: number;
  mouseY: number;

  selected: boolean = false;

  @ViewChild('dragRef', { static: false }) boardRef: ElementRef;

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
        this.computerMove();
      }
      this.selected = false;
      this.possibleCaptures = [];
      this.possibleMoves = [];
    } else {
      let pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);

      if (pieceClicked) {
        this.activePiece = pieceClicked;
        this.selected = true;
        this.possibleCaptures = pieceClicked.getPossibleCaptures();
        this.possibleMoves = pieceClicked.getPossibleMoves();
      }
    }
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

    piece.point = newPoint;

    this.checkIfPawnFirstMove(piece);
    // BoardComponent.pieces.push(piece);
    //    BoardComponent.pieces.delete(this.getPointByCoordinates(ySource, xSource));
    //  BoardComponent.pieces.set(new Point(yDest, xDest), piece);
  }

  isPointInPossibleMoves(point: Point): boolean {
    return this.possibleMoves.some(e => e.row === point.row && e.col === point.col);
  }

  isPointInPossibleCaptures(point: Point): boolean {
    return this.possibleCaptures.some(e => point.row && e.col === point.col);
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
    let blackPieces = BoardComponent.pieces
      .filter(e => e.color === Color.BLACK)
      .filter(e => e.getPossibleMoves().length > 0 || e.getPossibleCaptures().length > 0);
  
    if (blackPieces.length > 0) {
      let randomPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
      if (randomPiece.getPossibleCaptures().length > 0) {
        this.movePiece(randomPiece, randomPiece.getPossibleCaptures()[Math.floor(Math.random() * randomPiece.getPossibleCaptures().length)]);
      } else if (randomPiece.getPossibleMoves().length > 0) {
        this.movePiece(randomPiece, randomPiece.getPossibleMoves()[Math.floor(Math.random() * randomPiece.getPossibleCaptures().length)]);
      }
    }
  }
}
