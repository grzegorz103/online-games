import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Color} from "./models/color";
import {King} from "./models/king";
import {Point} from "./models/point";
import {Piece} from "./models/piece";
import {Pawn} from "./models/pawn";
import {Rook} from "./models/rook";
import {Knight} from "./models/knight";
import {Bishop} from "./models/bishop";
import {Queen} from "./models/queen";
import * as Stomp from 'stompjs';
import {environment} from "../../environments/environment";
import {BoardComponent} from "../board/board.component";

@Component({
  selector: 'app-chess-multiplayer',
  templateUrl: './chess-multiplayer.component.html',
  styleUrls: ['./chess-multiplayer.component.scss']
})
export class ChessMultiplayerComponent implements OnInit {

  aspectRatio = true;

  static uri: string;
  socket: WebSocket;
  ws: any;

  board: string[][];
  activePiece: Piece;
  static pieces: Piece[];
  possibleMoves: Point[];
  possibleCaptures: Point[];

  @ViewChild('dragRef', {static: false})
  boardRef: ElementRef;

  static currentColor: Color;
  private selected: any;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    ChessMultiplayerComponent.uri = this.route.snapshot.paramMap.get('game');
    this.board = [];
    this.possibleMoves = [];
    this.possibleCaptures = [];
    this.socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(this.socket);

    this.addPieces();
    if (ChessMultiplayerComponent.uri) {
      ChessMultiplayerComponent.currentColor = Color.BLACK;
      this.joinGame();
    } else {
      ChessMultiplayerComponent.currentColor = Color.WHITE;
      this.createGame();
    }

  }

  private joinGame() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });

      that.ws.subscribe("/user/queue/chess/move", message => {
        console.log(message.body);
        that.movePiece(message.body);
      });

      that.ws.send("/app/chess/" + ChessMultiplayerComponent.uri + '/join', {}, true);
    }, function (error) {
      that.socket.close();
    });
  }

  movePiece(coords0: string) {
    console.log('Move' + coords0.substring(0, 2));
    let srcPiece = ChessMultiplayerComponent.pieces.find(e => e.point.pointChar === coords0.substring(0, 2));
    if (srcPiece) {
      console.log('Znaleziono')
      srcPiece.point = this.coordsToPoint(coords0.substring(2, 4));
      console.log(coords0.substring(2, 4))
    } else {
      console.log('Nie znaleziono')
    }
  }


  coordsToPoint(coords: string) {
    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        if (this.board[i][j] === coords) {
          return new Point(i, j, this.board[i][j]);
        }
      }
    }
  }

  private createGame() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });

      that.ws.subscribe("/user/queue/chess/uri", message => {
        ChessMultiplayerComponent.uri = message.body;
      });

      that.ws.subscribe("/user/queue/chess/move", message => {
        console.log(message);
        that.movePiece(message.body);
      });

      that.ws.send("/app/chess/host", {}, true);

    }, function (error) {
      that.socket.close();
    });
  }


  onMouseDown(event) {
    let pointClicked = this.getClickPoint(event);
    console.log(pointClicked)
    if (this.selected) {
      if (this.isPointInPossibleMoves(pointClicked) || this.isPointInPossibleCaptures(pointClicked)) {
        this.ws.send("/app/chess/" + ChessMultiplayerComponent.uri + '/move/' + this.activePiece.point.pointChar + this.getCharPointByCoords(pointClicked.row, pointClicked.col), {}, {});
      }
      this.selected = false;
      this.possibleCaptures = [];
      this.possibleMoves = [];
    } else {
      let pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
      if (pieceClicked) {
        this.selected = true;
        console.log("ccccc")
        this.possibleMoves = pieceClicked.getPossibleMoves();
        this.possibleCaptures = pieceClicked.getPossibleCaptures();
        this.activePiece = pieceClicked;
        console.log(this.activePiece.point.pointChar)
      }
    }
  }

  getClickPoint(event) {
    return new Point(Math.floor((event.y - this.boardRef.nativeElement.getBoundingClientRect().top) / (this.boardRef.nativeElement.getBoundingClientRect().height / 8)),
      Math.floor((event.x - this.boardRef.nativeElement.getBoundingClientRect().left) / (this.boardRef.nativeElement.getBoundingClientRect().width / 8)), '');
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

  getCharPointByCoords(row: number, col: number): string {
    return this.board[row][col];
  }

  getPieceByPoint(row: number, col: number): Piece {
    row = Math.floor(row);
    col = Math.floor(col);
    return ChessMultiplayerComponent.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  isKingChecked(piece: Piece) {
    if (piece instanceof King) {
      //return piece.color === Color.WHITE ? this.whiteKingChecked : this.blackKingChecked;
    }
  }

  addPieces() {
    ChessMultiplayerComponent.pieces = [];

    if (ChessMultiplayerComponent.uri) {
      let c = 1;
      for (var i: number = 0; i < 8; ++i) {
        let d = 104;
        this.board[i] = [];
        for (var j: number = 0; j < 8; ++j) {
          this.board[i][j] = String.fromCharCode(d) + c;
          --d;
        }
        ++c;
      }

      console.log(this.board);

      let cw = 104;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.pieces.push(new Pawn(new Point(1, i, String.fromCharCode(cw) + '2'), Color.WHITE, 'pawn-white.png'));
        --cw;
      }
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(0, 0, 'h1'), Color.WHITE, 'rook-white.jpg'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(0, 1, 'g1'), Color.WHITE, 'knight-white.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(0, 2, 'f1'), Color.WHITE, 'bishop-white.png'));
      ChessMultiplayerComponent.pieces.push(new Queen(new Point(0, 3, 'e1'), Color.WHITE, 'queen-white.png'));
      ChessMultiplayerComponent.pieces.push(new King(new Point(0, 4, 'd1'), Color.WHITE, 'king-white.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(0, 5, 'c1'), Color.WHITE, 'bishop-white.png'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(0, 6, 'b1'), Color.WHITE, 'knight-white.png'));
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(0, 7, 'a1'), Color.WHITE, 'rook-white.jpg'));


      let cz = 104;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.pieces.push(new Pawn(new Point(6, i, String.fromCharCode(cz) + '7'), Color.BLACK, 'pawn-black.png'));
        --cz;
      }
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(7, 0, 'h8'), Color.BLACK, 'rook-black.png'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(7, 1, 'g8'), Color.BLACK, 'knight-black.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(7, 2, 'f8'), Color.BLACK, 'bishop-black.png'));
      ChessMultiplayerComponent.pieces.push(new Queen(new Point(7, 3, 'e8'), Color.BLACK, 'queen-black.png'));
      ChessMultiplayerComponent.pieces.push(new King(new Point(7, 4, 'd8'), Color.BLACK, 'king-black.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(7, 5, 'c8'), Color.BLACK, 'bishop-black.png'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(7, 6, 'b8'), Color.BLACK, 'knight-black.png'));
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(7, 7, 'a8'), Color.BLACK, 'rook-black.png'));

    } else {
      let c = 8;
      for (var i: number = 0; i < 8; ++i) {
        let d = 97;
        this.board[i] = [];
        for (var j: number = 0; j < 8; ++j) {
          console.log(c);
          this.board[i][j] = String.fromCharCode(d) + c;
          ++d;
        }
        --c;
      }

      console.log(this.board);

      let cx = 97;
      // piony czarne
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.pieces.push(new Pawn(new Point(1, i, String.fromCharCode(cx) + '7'), Color.BLACK, 'pawn-black.png'));
        ++cx;
      }
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(0, 0, 'a8'), Color.BLACK, 'rook-black.jpg'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(0, 1, 'b8'), Color.BLACK, 'knight-black.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(0, 2, 'c8'), Color.BLACK, 'bishop-black.png'));
      ChessMultiplayerComponent.pieces.push(new Queen(new Point(0, 3, 'd8'), Color.BLACK, 'queen-black.png'));
      ChessMultiplayerComponent.pieces.push(new King(new Point(0, 4, 'e8'), Color.BLACK, 'king-black.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(0, 5, 'f8'), Color.BLACK, 'bishop-black.png'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(0, 6, 'g8'), Color.BLACK, 'knight-black.png'));
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(0, 7, 'h8'), Color.BLACK, 'rook-black.jpg'));

      let x = 97;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.pieces.push(new Pawn(new Point(6, i, String.fromCharCode(x) + '2'), Color.WHITE, 'pawn-white.png'));
        ++x;
      }
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(7, 0, 'a1'), Color.WHITE, 'rook-white.png'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(7, 1, 'b1'), Color.WHITE, 'knight-white.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(7, 2, 'c1'), Color.WHITE, 'bishop-white.png'));
      ChessMultiplayerComponent.pieces.push(new Queen(new Point(7, 3, 'd1'), Color.WHITE, 'queen-white.png'));
      ChessMultiplayerComponent.pieces.push(new King(new Point(7, 4, 'e1'), Color.WHITE, 'king-white.png'));
      ChessMultiplayerComponent.pieces.push(new Bishop(new Point(7, 5, 'f1'), Color.WHITE, 'bishop-white.png'));
      ChessMultiplayerComponent.pieces.push(new Knight(new Point(7, 6, 'g1'), Color.WHITE, 'knight-white.png'));
      ChessMultiplayerComponent.pieces.push(new Rook(new Point(7, 7, 'h1'), Color.WHITE, 'rook-white.png'));

    }
  }

  static isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return ChessMultiplayerComponent.pieces.some(e => e.point.col === col && e.point.row === row && e.color === enemyColor);
  }

  static isFieldEmpty(row: number, col: number): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return !ChessMultiplayerComponent.pieces.some(e => e.point.col === col && e.point.row === row);
  }

  getUri() {
    return ChessMultiplayerComponent.uri;
  }
}
