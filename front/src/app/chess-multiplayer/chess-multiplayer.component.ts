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

  static board: Point[][];
  activePoint: Point;
  // static pieces: Piece[];
  possibleMoves: Point[];
  possibleCaptures: Point[];

  @ViewChild('dragRef', {static: false})
  boardRef: ElementRef;

  static currentColor: Color;
  private selected: any;

  isCurrentPlayer = false;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    ChessMultiplayerComponent.uri = this.route.snapshot.paramMap.get('game');
    ChessMultiplayerComponent.board = [];
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
        that.isCurrentPlayer = !that.isCurrentPlayer;
        that.movePiece(message.body);
      });

      that.ws.send("/app/chess/" + ChessMultiplayerComponent.uri + '/join', {}, true);
    }, function (error) {
      that.socket.close();
    });
  }

  movePiece(coords0: string) {
    console.log('Move' + coords0.substring(0, 2));
    let srcPiece = this.coordsToPoint(coords0.substring(0, 2));
    if (srcPiece) {
      console.log('Znaleziono')
      let destPoint = this.coordsToPoint(coords0.substring(2, 4));
      destPoint.piece = srcPiece.piece;
      srcPiece.piece = null;
      console.log(coords0.substring(2, 4))
    } else {
      console.log('Nie znaleziono')
    }
  }


  coordsToPoint(coords: string) {
    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        if (ChessMultiplayerComponent.board[i][j].pointChar === coords) {
          return ChessMultiplayerComponent.board[i][j];
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
        that.isCurrentPlayer = !that.isCurrentPlayer;
        that.movePiece(message.body);
      });

      that.ws.send("/app/chess/host", {}, true);

    }, function (error) {
      that.socket.close();
    });
  }


  onMouseDown(event) {

    if (!this.isCurrentPlayer) {
      return;
    }

    let pointClicked = this.getClickPoint(event);

    if (pointClicked.piece && pointClicked.piece.color !== ChessMultiplayerComponent.currentColor) {
      return;
    }

    if (this.selected) {
      if (this.isPointInPossibleMoves(pointClicked) || this.isPointInPossibleCaptures(pointClicked)) {
        this.ws.send("/app/chess/" + ChessMultiplayerComponent.uri + '/move/' + this.activePoint.pointChar + this.getCharPointByCoords(pointClicked.row, pointClicked.col), {}, {});
      }
      this.selected = false;
      this.possibleCaptures = [];
      this.possibleMoves = [];
    } else {
      let pieceClicked = pointClicked.piece;
      if (pieceClicked) {
        this.selected = true;
        console.log("ccccc")
        this.possibleMoves = pieceClicked.getPossibleMoves();
        this.possibleCaptures = pieceClicked.getPossibleCaptures();
        this.activePoint = pointClicked;
      }
    }
  }

  static isFieldUnderAttack(row: number, col: number, color: Color) {
    let found = false;
    let field = ChessMultiplayerComponent.board[row][col];

    return field.piece && field.piece.getCoveredFields().some(e => e === field);
  }

  getClickPoint(event) {
    return ChessMultiplayerComponent.board
      [Math.floor((event.y - this.boardRef.nativeElement.getBoundingClientRect().top) / (this.boardRef.nativeElement.getBoundingClientRect().height / 8))]
      [Math.floor((event.x - this.boardRef.nativeElement.getBoundingClientRect().left) / (this.boardRef.nativeElement.getBoundingClientRect().width / 8))];
  }

  isPointInPossibleMoves(point: Point): boolean {
    return this.possibleMoves.some(e => e.row === point.row && e.col === point.col);
  }

  getBoard() {
    return ChessMultiplayerComponent.board;
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
    return ChessMultiplayerComponent.board[row][col].pointChar;
  }

  getPieceByPoint(row: number, col: number): Piece {
    row = Math.floor(row);
    col = Math.floor(col);
    return ChessMultiplayerComponent.board[row][col].piece;
    // return ChessMultiplayerComponent.pieces.find(e => e.point.col === col && e.point.row === row);
  }

  isKingChecked(piece: Piece) {
    if (piece instanceof King) {
      //return piece.color === Color.WHITE ? this.whiteKingChecked : this.blackKingChecked;
    }
  }

  static getPointByPiece(piece: Piece) {
    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        if (this.board[i][j].piece === piece) {
          return this.board[i][j];
        }
      }
    }
    throw Error('Point not found');
  }

  static getPointByCoords(row: number, col: number) {
    return this.board[row][col];
  }

  addPieces() {
    //  ChessMultiplayerComponent.board = [];

    if (ChessMultiplayerComponent.uri) {
      let c = 1;
      this.isCurrentPlayer = false;
      for (var i: number = 0; i < 8; ++i) {
        let d = 104;
        ChessMultiplayerComponent.board[i] = [];
        for (var j: number = 0; j < 8; ++j) {
          ChessMultiplayerComponent.board[i][j] = new Point(i, j, String.fromCharCode(d) + c, null);
          --d;
        }
        ++c;
      }

      console.log(ChessMultiplayerComponent.board);

      let cw = 104;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.getPointByCoords(1, i).piece = new Pawn(Color.WHITE, 'pawn-white.png');
        --cw;
      }
      ChessMultiplayerComponent.getPointByCoords(0, 0).piece = new Rook(Color.WHITE, 'rook-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 1).piece = new Knight(Color.WHITE, 'knight-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 2).piece = new Bishop(Color.WHITE, 'bishop-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 3).piece = new Queen(Color.WHITE, 'queen-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 4).piece = new King(Color.WHITE, 'king-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 5).piece = new Bishop(Color.WHITE, 'bishop-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 6).piece = new Knight(Color.WHITE, 'knight-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 7).piece = new Rook(Color.WHITE, 'rook-white.png');

      let cz = 104;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.getPointByCoords(6, i).piece = new Pawn(Color.BLACK, 'pawn-black.png');
        --cz;
      }
      ChessMultiplayerComponent.getPointByCoords(7, 0).piece = new Rook(Color.BLACK, 'rook-black.jpg');
      ChessMultiplayerComponent.getPointByCoords(7, 1).piece = new Knight(Color.BLACK, 'knight-black.png');
      ChessMultiplayerComponent.getPointByCoords(7, 2).piece = new Bishop(Color.BLACK, 'bishop-black.png');
      ChessMultiplayerComponent.getPointByCoords(7, 3).piece = new Queen(Color.BLACK, 'queen-black.png');
      ChessMultiplayerComponent.getPointByCoords(7, 4).piece = new King(Color.BLACK, 'king-black.png');
      ChessMultiplayerComponent.getPointByCoords(7, 5).piece = new Bishop(Color.BLACK, 'bishop-black.png');
      ChessMultiplayerComponent.getPointByCoords(7, 6).piece = new Knight(Color.BLACK, 'knight-black.png');
      ChessMultiplayerComponent.getPointByCoords(7, 7).piece = new Rook(Color.BLACK, 'rook-black.jpg');

    } else {
      this.isCurrentPlayer = true;
      let c = 8;
      for (var i: number = 0; i < 8; ++i) {
        let d = 97;
        ChessMultiplayerComponent.board[i] = [];
        for (var j: number = 0; j < 8; ++j) {
          console.log(c);
          ChessMultiplayerComponent.board[i][j] = new Point(i, j, String.fromCharCode(d) + c, null);
          ++d;
        }
        --c;
      }

      console.log(ChessMultiplayerComponent.board);

      let cx = 97;
      // piony czarne
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.getPointByCoords(1, i).piece = new Pawn(Color.BLACK, 'pawn-black.png');
        ++cx;
      }

      ChessMultiplayerComponent.getPointByCoords(0, 0).piece = new Rook(Color.BLACK, 'rook-black.jpg');
      ChessMultiplayerComponent.getPointByCoords(0, 1).piece = new Knight(Color.BLACK, 'knight-black.png');
      ChessMultiplayerComponent.getPointByCoords(0, 2).piece = new Bishop(Color.BLACK, 'bishop-black.png');
      ChessMultiplayerComponent.getPointByCoords(0, 3).piece = new Queen(Color.BLACK, 'queen-black.png');
      ChessMultiplayerComponent.getPointByCoords(0, 4).piece = new King(Color.BLACK, 'king-black.png');
      ChessMultiplayerComponent.getPointByCoords(0, 5).piece = new Bishop(Color.BLACK, 'bishop-black.png');
      ChessMultiplayerComponent.getPointByCoords(0, 6).piece = new Knight(Color.BLACK, 'knight-black.png');
      ChessMultiplayerComponent.getPointByCoords(0, 7).piece = new Rook(Color.BLACK, 'rook-black.jpg');

      let x = 97;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.getPointByCoords(6, i).piece = new Pawn(Color.WHITE, 'pawn-white.png');
        ++x;
      }

      ChessMultiplayerComponent.getPointByCoords(7, 0).piece = new Rook(Color.WHITE, 'rook-white.png');
      ChessMultiplayerComponent.getPointByCoords(7, 1).piece = new Knight(Color.WHITE, 'knight-white.png');
      ChessMultiplayerComponent.getPointByCoords(7, 2).piece = new Bishop(Color.WHITE, 'bishop-white.png');
      ChessMultiplayerComponent.getPointByCoords(7, 3).piece = new Queen(Color.WHITE, 'queen-white.png');
      ChessMultiplayerComponent.getPointByCoords(7, 4).piece = new King(Color.WHITE, 'king-white.png');
      ChessMultiplayerComponent.getPointByCoords(7, 5).piece = new Bishop(Color.WHITE, 'bishop-white.png');
      ChessMultiplayerComponent.getPointByCoords(7, 6).piece = new Knight(Color.WHITE, 'knight-white.png');
      ChessMultiplayerComponent.getPointByCoords(7, 7).piece = new Rook(Color.WHITE, 'rook-white.png');
    }
  }

  static isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    let piece = ChessMultiplayerComponent.board[row][col].piece;

    return piece !== null && piece.color === enemyColor;
    //   return ChessMultiplayerComponent.board.some(e => e.point.col === col && e.point.row === row && e.color === enemyColor);
  }

  static isFieldEmpty(row: number, col: number): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return ChessMultiplayerComponent.getPointByCoords(row, col).piece === null;
    // return !ChessMultiplayerComponent.pieces.some(e => e.point.col === col && e.point.row === row);
  }

  getUri() {
    return ChessMultiplayerComponent.uri;
  }
}
