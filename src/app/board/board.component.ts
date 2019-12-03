import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Point } from '../models/point';
import { Piece } from '../models/piece';
import { Pawn } from '../models/pawn';
import { Color } from '../models/color';
import { Rook } from '../models/rook';


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
  ngOnInit() {
  }
  board: number[][];
  static pieces: Piece[];
  possibleMoves: Point[];

  mouseX: number;
  mouseY: number;

  selected: boolean = false;

  @ViewChild('dragRef', { static: false }) boardRef: ElementRef;

  constructor() {
    this.board = [];
    this.possibleMoves = [];

    for (var i: number = 0; i < 8; ++i) {
      this.board[i] = [];
      for (var j: number = 0; j < 8; ++j) {
        this.board[i][j] = 0;
      }
    }

    this.addPieces();
  }

  addPieces() {
    BoardComponent.pieces = [];

    // piony czarne
    for (let i = 0; i < 8; ++i) {
      BoardComponent.pieces.push(new Pawn(new Point(1, i), Color.BLACK, 'pawn-black.png'));
    }
    BoardComponent.pieces.push(new Rook(new Point(0, 0), Color.BLACK, 'rook-black.jpg'));
    BoardComponent.pieces.push(new Rook(new Point(0, 7), Color.BLACK, 'rook-black.jpg'));
    BoardComponent.pieces.push(new Rook(new Point(0, 1), Color.BLACK, 'knight-black.png'));
    BoardComponent.pieces.push(new Rook(new Point(0, 2), Color.BLACK, 'bishop-black.png'));
    BoardComponent.pieces.push(new Rook(new Point(0, 3), Color.BLACK, 'king-black.png'));
    BoardComponent.pieces.push(new Rook(new Point(0, 4), Color.BLACK, 'queen-black.png'));
    BoardComponent.pieces.push(new Rook(new Point(0, 5), Color.BLACK, 'bishop-black.png'));
    BoardComponent.pieces.push(new Rook(new Point(0, 6), Color.BLACK, 'knight-black.png'));


    // piony biale
    for (let i = 0; i < 8; ++i) {
      BoardComponent.pieces.push(new Pawn(new Point(6, i), Color.WHITE, 'pawn-white.png'));
    }
    BoardComponent.pieces.push(new Rook(new Point(7, 0), Color.WHITE, 'rook-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 7), Color.WHITE, 'rook-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 1), Color.WHITE, 'knight-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 2), Color.WHITE, 'bishop-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 3), Color.WHITE, 'king-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 4), Color.WHITE, 'queen-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 5), Color.WHITE, 'bishop-white.png'));
    BoardComponent.pieces.push(new Rook(new Point(7, 6), Color.WHITE, 'knight-white.png'));
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
      this.movePiece(this.activePiece, pointClicked);
      this.selected = false;
      this.possibleMoves = [];
    } else {
      let pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);

      if (pieceClicked) {
        this.activePiece = pieceClicked;
        this.selected = true;
        this.possibleMoves = pieceClicked.getPossibleMoves();
        console.log(this.possibleMoves);
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
    BoardComponent.pieces.push(piece);
    //    BoardComponent.pieces.delete(this.getPointByCoordinates(ySource, xSource));
    //  BoardComponent.pieces.set(new Point(yDest, xDest), piece);
  }

  isPointInPossibleMoves(row: number, col: number): boolean {
    return this.possibleMoves.some(e => e.row === row && e.col === col);
  }
}
