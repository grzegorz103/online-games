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
  private whiteKingChecked: boolean;
  private blackKingChecked: boolean;
  isLoading: boolean = true;
  playersReady: boolean = false;
  calculation: number;

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
        that.isCurrentPlayer = !that.isCurrentPlayer;
        that.movePiece(message.body);
      });

      that.ws.subscribe("/user/queue/chess/start", message => {
        that.isLoading = false;
        that.playersReady = true;
        that.calculateAdvantage();
      });

      that.ws.send("/app/chess/" + ChessMultiplayerComponent.uri + '/join', {}, true);
    }, function (error) {
      that.socket.close();
    });
  }

  movePiece(coords0: string) {
    let srcPiece = this.coordsToPoint(coords0.substring(0, 2));
    if (srcPiece) {
      let destPoint = this.coordsToPoint(coords0.substring(2, 4));
      this.checkIfPawnFirstMove(srcPiece.piece);
      destPoint.piece = srcPiece.piece;
      srcPiece.piece = null;

      if (coords0.length > 7) {
        let rook = this.coordsToPoint(coords0.substring(4, 6));
        let newPointForRook = this.coordsToPoint(coords0.substring(6, 8));
        newPointForRook.piece = rook.piece;
        rook.piece = null;
      }

      this.whiteKingChecked = this.isKingInCheck(Color.WHITE);
      this.blackKingChecked = this.isKingInCheck(Color.BLACK);

      this.calculateAdvantage();

    } else {
    }
  }

  isKingInCheck(color: Color): boolean {
    let kingPiece;

    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        let piece = ChessMultiplayerComponent.board[i][j].piece
        if (piece && piece.color === color && piece instanceof King) {
          kingPiece = ChessMultiplayerComponent.board[i][j];
        }
      }
    }
    if (kingPiece) {
      for (var i = 0; i < 8; ++i) {
        for (var j = 0; j < 8; ++j) {
          let piece = ChessMultiplayerComponent.board[i][j].piece
          if (piece && piece.color !== color) {
            if (piece.getPossibleCaptures().some(e => e === kingPiece)) {
              return true;
            }
          }
        }
      }
    }
    return false;
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
        that.isLoading = false;
        that.playersReady = false;
        that.calculateAdvantage();
      });

      that.ws.subscribe("/user/queue/chess/start", message => {
        that.playersReady = true;
      });

      that.ws.subscribe("/user/queue/chess/move", message => {
        that.isCurrentPlayer = !that.isCurrentPlayer;
        that.movePiece(message.body);
      });

      that.ws.send("/app/chess/host", {}, true);

    }, function (error) {
      that.socket.close();
    });
  }

  isCurrentWhiteColor() {
    return ChessMultiplayerComponent.currentColor === Color.WHITE;
  }

  onMouseDown(event) {

    if (!this.isCurrentPlayer) {
      return;
    }

    let pointClicked = this.getClickPoint(event);


    if (this.selected) {
      if (this.isPointInPossibleMoves(pointClicked) || this.isPointInPossibleCaptures(pointClicked)) {
        let params = "/app/chess/" + ChessMultiplayerComponent.uri + '/move/' + this.activePoint.pointChar + this.getCharPointByCoords(pointClicked.row, pointClicked.col)
        if (this.activePoint.piece instanceof King) {
          if (Math.abs(pointClicked.col - this.activePoint.col) > 1) {
            if (pointClicked.col < this.activePoint.col) {
              params += this.getCharPointByCoords(7, 0) + this.getCharPointByCoords(7, this.activePoint.col - 1);
            } else {
              params += this.getCharPointByCoords(7, 7) + this.getCharPointByCoords(7, this.activePoint.col + 1);
            }
          }
        }
        console.log(params)
        this.ws.send(params, {}, {});
      }
      this.selected = false;
      this.possibleCaptures = [];
      this.possibleMoves = [];
    } else {
      let pieceClicked = pointClicked.piece;
      if (pieceClicked) {
        if (pieceClicked.color !== ChessMultiplayerComponent.currentColor) {
          return;
        }
        if (ChessMultiplayerComponent.currentColor === Color.WHITE) {
          if (this.whiteKingChecked && (pieceClicked instanceof King)) {
            this.activePoint = pointClicked;
            this.possibleCaptures = this.getPossibleCapturesForKingInCheck(Color.WHITE).filter(e => !this.willMoveCauseCheck(Color.WHITE, pointClicked.row, pointClicked.col, e.row, e.col));
            this.possibleMoves = this.getPossibleMovesForKingInCheck(Color.WHITE).filter(e => !this.willMoveCauseCheck(Color.WHITE, pointClicked.row, pointClicked.col, e.row, e.col));

            this.selected = true;
          } else if (!this.whiteKingChecked) {
            this.activePoint = pointClicked;
            this.selected = true;
            this.possibleCaptures = pieceClicked.getPossibleCaptures().filter(e => !this.willMoveCauseCheck(Color.WHITE, pointClicked.row, pointClicked.col, e.row, e.col));
            this.possibleMoves = pieceClicked.getPossibleMoves().filter(e => !this.willMoveCauseCheck(Color.WHITE, pointClicked.row, pointClicked.col, e.row, e.col));

          } else if (this.whiteKingChecked && !(pieceClicked instanceof King)) {
            this.selected = true;
            this.activePoint = pointClicked;
            this.possibleMoves = this.getPossibleMovesForKingInCheck2(Color.WHITE);
            this.possibleCaptures = this.getPossibleCapturesForKingInCheck2(Color.WHITE);
          }

        } else {
          if (this.blackKingChecked && (pieceClicked instanceof King)) {
            this.activePoint = pointClicked;
            this.possibleCaptures = this.getPossibleCapturesForKingInCheck(Color.BLACK).filter(e => !this.willMoveCauseCheck(Color.BLACK, pointClicked.row, pointClicked.col, e.row, e.col));
            this.possibleMoves = this.getPossibleMovesForKingInCheck(Color.BLACK).filter(e => !this.willMoveCauseCheck(Color.BLACK, pointClicked.row, pointClicked.col, e.row, e.col));

            this.selected = true;
          } else if (!this.blackKingChecked) {
            this.activePoint = pointClicked;
            this.selected = true;
            this.possibleCaptures = pieceClicked.getPossibleCaptures().filter(e => !this.willMoveCauseCheck(Color.BLACK, pointClicked.row, pointClicked.col, e.row, e.col));
            this.possibleMoves = pieceClicked.getPossibleMoves().filter(e => !this.willMoveCauseCheck(Color.BLACK, pointClicked.row, pointClicked.col, e.row, e.col));

          } else if (this.blackKingChecked && !(pieceClicked instanceof King)) {
            this.selected = true;
            this.activePoint = pointClicked;
            this.possibleMoves = this.getPossibleMovesForKingInCheck2(Color.BLACK)
            this.possibleCaptures = this.getPossibleCapturesForKingInCheck2(Color.BLACK);
          }
        }

      }
    }
  }

  getPossibleMovesForKingInCheck2(color: Color) {
    let currentActivePiece = this.activePoint.piece;
    let tempPossibleMoves = [];
    this.activePoint.piece.getPossibleMoves().forEach(piece => {
      piece.piece = this.activePoint.piece;
      this.activePoint.piece = null;
      if (!this.isKingInCheck(color)) {
        tempPossibleMoves.push(piece);
      }
      this.activePoint.piece = piece.piece;
      piece.piece = null
    });

    return tempPossibleMoves;
  }


  getPossibleCapturesForKingInCheck2(color: Color) {
    let currentActivePoint = this.activePoint;
    let tempPossibleCaptures = [];
    this.activePoint.piece.getPossibleCaptures().forEach(piece => {
      let removedPoint = ChessMultiplayerComponent.getPointByCoords(piece.row, piece.col);
      let removedPiece = removedPoint.piece;
      removedPoint.piece = null;
      this.activePoint = piece;
      if (!this.isKingInCheck(color)) {
        tempPossibleCaptures.push(this.activePoint);
      }
      removedPoint.piece = removedPiece;
    });
    this.activePoint = currentActivePoint;

    return tempPossibleCaptures;
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
      return piece.color === Color.WHITE ? this.whiteKingChecked : this.blackKingChecked;
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


      let cw = 104;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.getPointByCoords(1, i).piece = new Pawn(Color.WHITE, 'pawn-white.png');
        --cw;
      }
      ChessMultiplayerComponent.getPointByCoords(0, 0).piece = new Rook(Color.WHITE, 'rook-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 1).piece = new Knight(Color.WHITE, 'knight-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 2).piece = new Bishop(Color.WHITE, 'bishop-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 3).piece = new King(Color.WHITE, 'king-white.png');
      ChessMultiplayerComponent.getPointByCoords(0, 4).piece = new Queen(Color.WHITE, 'queen-white.png');
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
      ChessMultiplayerComponent.getPointByCoords(7, 3).piece = new King(Color.BLACK, 'king-black.png');
      ChessMultiplayerComponent.getPointByCoords(7, 4).piece = new Queen(Color.BLACK, 'queen-black.png');
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
          ChessMultiplayerComponent.board[i][j] = new Point(i, j, String.fromCharCode(d) + c, null);
          ++d;
        }
        --c;
      }


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

    return piece && piece.color === enemyColor;
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

  private checkIfPawnFirstMove(piece: Piece) {
    if (piece instanceof Pawn) {
      (piece as Pawn).isMovedAlready = true;
    }
  }

  getPossibleCapturesForKingInCheck(color: Color) {
    let kingPiece: Point;

    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        let piece = ChessMultiplayerComponent.board[i][j].piece
        if (piece && piece.color === color && piece instanceof King) {
          kingPiece = ChessMultiplayerComponent.board[i][j];
          console.log(kingPiece)
          console.log('znalazlo krola')
        }
      }
    }

    let possiblePoints = [];

    let row = kingPiece.row;
    let col = kingPiece.col;

    // lewo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row - 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldTakenByEnemy(row + 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
    }

    return possiblePoints;
  }

  getPossibleMovesForKingInCheck(color: Color) {
    let kingPiece: Point;

    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        let piece = ChessMultiplayerComponent.board[i][j].piece
        if (piece && piece.color === color && piece instanceof King) {
          kingPiece = ChessMultiplayerComponent.board[i][j];
        }
      }
    }
    let possiblePoints = [];

    let row = kingPiece.row;
    let col = kingPiece.col;

    // lewo
    if (ChessMultiplayerComponent.isFieldEmpty(row, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col - 1));
    }

    // prawo
    if (ChessMultiplayerComponent.isFieldEmpty(row, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row, col + 1));
    }

    // dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col));
    }

    // gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col));
    }

    // lewo gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col - 1));
    }
    // prawo gora
    if (ChessMultiplayerComponent.isFieldEmpty(row - 1, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row - 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row - 1, col + 1));
    }

    // lewo dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col - 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col - 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col - 1));
    }
    // prawo dol
    if (ChessMultiplayerComponent.isFieldEmpty(row + 1, col + 1) && !ChessMultiplayerComponent.isFieldUnderAttack(row + 1, col + 1, color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
      possiblePoints.push(ChessMultiplayerComponent.getPointByCoords(row + 1, col + 1));
    }
    return possiblePoints;
  }

  public willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number) {
    let tempBoard = ChessMultiplayerComponent.board;
    /*  BoardComponent.pieces = BoardComponent.pieces.filter(piece =>
        (piece.point.col !== col) || (piece.point.row !== row)
      );*/
    let srcPiece = ChessMultiplayerComponent.getPointByCoords(row, col);
    let destPiece = ChessMultiplayerComponent.getPointByCoords(destRow, destCol);
    console.log(srcPiece + 'zrodlowy')
    console.log(destPiece + ' doce')
    let tempPiece = null;
    if (destPiece.piece) {
      tempPiece = destPiece.piece;
    }

    if (srcPiece) {
      destPiece.piece = srcPiece.piece;
      srcPiece.piece = null;
    }

    let isBound = this.isKingInCheck(currentColor);

    if (srcPiece) {
      srcPiece.piece = destPiece.piece;
    }

    if (destPiece.piece) {
      destPiece.piece = tempPiece;
    }

    return isBound;
  }

  apiUrl() {
    return environment.appUrl;
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Skopiowano link do schowka')
  }

  private calculateAdvantage() {
    let blackPoints = 0, whitePoints = 0;
    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        let piece = ChessMultiplayerComponent.board[i][j].piece
        if (piece) {
          if (piece.color === Color.WHITE) {
            whitePoints += piece.relValue;
          } else {
            blackPoints += piece.relValue;
          }
        }
      }
    }

    this.calculation = whitePoints / (whitePoints + blackPoints) * 100;
  }
}
