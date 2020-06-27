import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
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
import {ChessPromoteDialogComponent} from "../chess-promote-dialog/chess-promote-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {log} from "util";

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
  isLoading: boolean = false;
  playersReady: boolean = false;
  calculation: number;
  static enPassantPoint: Point = null;
  static enPassantable: Point = null;
  private promotionResult: number;
  static isWhiteBottom: boolean;
  static isGameFinished: boolean = false;
  colorChoosen: boolean = false;
  abandoned: boolean = false;
  private destMove: string;
  private sourceMove: string;
  currentPlayerTime: number = 300;
  enemyPlayerTime: number = 300;
  currentPlayerTimeString: string = new Date(this.currentPlayerTime * 1000).toISOString().substring(11, 19);
  enemyPlayerTimeString: string = new Date(this.enemyPlayerTime * 1000).toISOString().substring(11, 19);

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    ChessMultiplayerComponent.uri = this.route.snapshot.paramMap.get('game');
    ChessMultiplayerComponent.board = [];
    this.possibleMoves = [];
    this.possibleCaptures = [];
    this.socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(this.socket);

    if (ChessMultiplayerComponent.uri) {
      this.joinGame();
    } else {
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

      that.ws.subscribe("/user/queue/chess/abandon", message => {
        that.abandoned = true;
      });

      that.ws.subscribe("/user/queue/chess/update", message => {
        ChessMultiplayerComponent.currentColor = ChessMultiplayerComponent.currentColor === Color.BLACK ? Color.WHITE : Color.BLACK;
        that.addPieces();
      });

      that.ws.subscribe("/user/queue/chess/start", message => {
        that.isLoading = false;
        that.playersReady = true;
        ChessMultiplayerComponent.currentColor = (JSON.parse(message.body)) ? Color.WHITE : Color.BLACK;
        that.addPieces();
        that.calculateAdvantage();
        that.startTimer();
      });

      that.ws.send("/app/chess/" + ChessMultiplayerComponent.uri + '/join', {}, true);
    }, function (error) {
      that.socket.close();
    });
  }

  movePiece(coords0: string) {
    let srcPiece = this.coordsToPoint(coords0.substring(0, 2));
    if (srcPiece) {
      if (coords0.length > 3) {
        let destPoint = this.coordsToPoint(coords0.substring(2, 4));

        if (coords0.endsWith('@')) {
          ChessMultiplayerComponent.enPassantPoint = null;
          if (ChessMultiplayerComponent.enPassantable != null)
            ChessMultiplayerComponent.enPassantable.piece = null;
        }

        if (coords0.match('[a-z0-9]*#\\d')) {
          this.isPawnPromoting(srcPiece, destPoint, Number(coords0.substring(coords0.length - 1, coords0.length)));
        }

        this.checkIfPawnEnPassant(srcPiece, destPoint);
        this.checkIfPawnFirstMove(srcPiece.piece);
        // this.checkIfPawnCaptuerEnPassant(srcPiece, destPoint);
        destPoint.piece = srcPiece.piece;
        srcPiece.piece = null;
        this.sourceMove = coords0.substring(0, 2);
        this.destMove = coords0.substring(2, 4);
      }

      if (coords0.length > 7) {
        let rook = this.coordsToPoint(coords0.substring(4, 6));
        let newPointForRook = this.coordsToPoint(coords0.substring(6, 8));
        newPointForRook.piece = rook.piece;
        rook.piece = null;
      }

      this.whiteKingChecked = this.isKingInCheck(Color.WHITE);
      if (this.whiteKingChecked) {
        // mat biale
        this.checkForMate(Color.WHITE, 'Szach mat! Czarne wygrały');
      } else {
        this.checkForPat(Color.WHITE);
      }

      this.blackKingChecked = this.isKingInCheck(Color.BLACK);

      if (this.blackKingChecked) {
        //  mat czarne
        this.checkForMate(Color.BLACK, 'Szach mat! Białe wygrały');
      } else {
        this.checkForPat(Color.BLACK);
      }

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
      });

      that.ws.subscribe("/user/queue/chess/abandon", message => {
        that.abandoned = true;
      });

      that.ws.subscribe("/user/queue/chess/update", message => {
        ChessMultiplayerComponent.currentColor = ChessMultiplayerComponent.currentColor === Color.BLACK ? Color.WHITE : Color.BLACK;
        that.addPieces();
      });

      that.ws.subscribe("/user/queue/chess/start", message => {
        that.isLoading = false;
        that.playersReady = true;
        ChessMultiplayerComponent.currentColor = (JSON.parse(message.body)) ? Color.WHITE : Color.BLACK;
        that.addPieces();
        that.calculateAdvantage();
        that.startTimer();
      });

      that.ws.subscribe("/user/queue/chess/move", message => {
        that.isCurrentPlayer = !that.isCurrentPlayer;
        that.movePiece(message.body);
      });


    }, function (error) {
      that.socket.close();
    });
  }

  isCurrentWhiteColor() {
    return ChessMultiplayerComponent.currentColor === Color.WHITE;
  }

  async onMouseDown(event) {
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

        if (this.activePoint.piece instanceof Pawn && pointClicked == ChessMultiplayerComponent.enPassantPoint) {
          params += '@';
        }

        await this.checkPawnForPromotion(this.activePoint, pointClicked);
        if (this.promotionResult > 0) {
          params += '#' + this.promotionResult;
        }
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
            this.possibleMoves = pieceClicked.getPossibleMoves().filter(e =>
              !this.willMoveCauseCheck(Color.WHITE, pointClicked.row, pointClicked.col, e.row, e.col));

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
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return null;
    }
    return this.board[row][col];
  }

  addPieces() {
    //  ChessMultiplayerComponent.board = [];
    ChessMultiplayerComponent.isGameFinished = false;
    this.blackKingChecked = false;
    this.whiteKingChecked = false;
    if (ChessMultiplayerComponent.currentColor === Color.WHITE) {
      this.isCurrentPlayer = true;
      ChessMultiplayerComponent.isWhiteBottom = true;
    } else {
      this.isCurrentPlayer = false;
      ChessMultiplayerComponent.isWhiteBottom = false;
    }
    if (ChessMultiplayerComponent.currentColor === Color.BLACK) {
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

    this.calculateAdvantage();

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

    let config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.duration = 2000;
    config.panelClass = ['share-friend-bar'];
    this.snackBar.open('Skopiowano link do schowka', null, config);
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
    if (!ChessMultiplayerComponent.isWhiteBottom) {
      [whitePoints, blackPoints] = [blackPoints, whitePoints]
    }

    this.calculation = whitePoints / (whitePoints + blackPoints) * 100;
  }

  private checkForMate(color: Color, text: string) {
    let arr: Point[] = [];
    for (var i = 0; i < 8; ++i) {
      for (var j = 0; j < 8; ++j) {
        let point = ChessMultiplayerComponent.board[i][j]
        if (point.piece) {
          if (point.piece.color === color) {
            arr.push(point);
          }
        }
      }
    }

    if (arr.every(point => {
      return point.piece.getPossibleMoves().every(e => this.willMoveCauseCheck(point.piece.color, point.row, point.col, e.row, e.col))
        && point.piece.getPossibleCaptures().every(e => this.willMoveCauseCheck(point.piece.color, point.row, point.col, e.row, e.col))
    })) {
      alert(text);
      ChessMultiplayerComponent.isGameFinished = true;
    }

  }

  private checkIfPawnEnPassant(srcPoint: Point, destPoint: Point) {
    if (srcPoint.piece instanceof Pawn && (Math.abs(srcPoint.row - destPoint.row) > 1)) {
      ChessMultiplayerComponent.enPassantPoint = ChessMultiplayerComponent.getPointByCoords((srcPoint.row + destPoint.row) / 2, srcPoint.col);
      ChessMultiplayerComponent.enPassantable = destPoint;
    } else {
      ChessMultiplayerComponent.enPassantable = null;
      ChessMultiplayerComponent.enPassantPoint = null;
    }
  }

  private async checkPawnForPromotion(srcPiece: Point, destPoint: Point) {
    if (srcPiece.piece instanceof Pawn && destPoint.row === 0) {
      return this.openPromoteDialog(srcPiece);
    }
  }

  async openPromoteDialog(point: Point) {
    const dialogRef = this.dialog.open(ChessPromoteDialogComponent, {
      width: '450px',
      data: {}
    });

    return dialogRef.afterClosed()
      .toPromise()
      .then(result => {
        if (result) {
          this.promotionResult = result;
        } else {
          this.promotionResult = 1;
        }
      });
  }

  private isPawnPromoting(srcPoint: Point, destPoint: Point, promotionChose: number) {
    if (srcPoint.piece instanceof Pawn && (destPoint.row === 0 || destPoint.row === 7)) {
      let isWhite = srcPoint.piece.color === Color.WHITE;
      switch (promotionChose) {
        case 1:
          srcPoint.piece = new Queen(srcPoint.piece.color, isWhite ? 'queen-white.png' : 'queen-black.png');
          break;
        case 2:
          srcPoint.piece = new Rook(srcPoint.piece.color, isWhite ? 'rook-white-png' : 'rook-black.jpg');
          break;
        case 3:
          srcPoint.piece = new Bishop(srcPoint.piece.color, isWhite ? 'bishop-white.png' : 'bishop-black.png');
          break;
        case 4:
          srcPoint.piece = new Knight(srcPoint.piece.color, isWhite ? 'knight-white.png' : 'knight-black.png');
          break;
        default:
          srcPoint.piece = new Queen(srcPoint.piece.color, isWhite ? 'queen-white.png' : 'queen-black.png');
          break;
      }
    }
  }

  rotateBoard() {
    ChessMultiplayerComponent.isWhiteBottom = !ChessMultiplayerComponent.isWhiteBottom;

    ChessMultiplayerComponent.board = ChessMultiplayerComponent.board.reverse();
    for (let i = 0; i < 8; ++i) {
      ChessMultiplayerComponent.board[i] = ChessMultiplayerComponent.board[i].reverse()
    }

    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        ChessMultiplayerComponent.board[i][j].col = j;
        ChessMultiplayerComponent.board[i][j].row = i;
      }
    }
    this.calculateAdvantage();
  }

  isWhiteBottom() {
    return ChessMultiplayerComponent.isWhiteBottom;
  }

  sendRematchOffer() {
    this.ws.send("/app/chess/" + this.getUri() + "/rematch", {}, {});
  }

  getIsGameFinished() {
    return ChessMultiplayerComponent.isGameFinished;
  }

  changeColor(number: number) {
    switch (number) {
      case 1:
        ChessMultiplayerComponent.currentColor = Color.BLACK;
        break;
      case 2:
        ChessMultiplayerComponent.currentColor = Color.WHITE;
        break;
      case 3:
        ChessMultiplayerComponent.currentColor = (Math.floor(Math.random() * 2) + 1 === 1) ? Color.BLACK : Color.WHITE;
        break;
      default:
        ChessMultiplayerComponent.currentColor = Color.WHITE;
    }
  }

  sendCreateGameRequest() {
    this.colorChoosen = true;
    this.isLoading = true;
    this.waitForSocketConnection();
  }

  waitForSocketConnection() {
    setTimeout(() => {
      if (this.socket.readyState === 1) {
        console.log('Connection established')
        this.ws.send("/app/chess/host", {}, ChessMultiplayerComponent.currentColor === Color.WHITE);
      } else {
        console.log('Wait for connection')
        this.waitForSocketConnection();
      }
    }, 500);
  }

  isXYInSourceMove(i: number, j: number) {
    let sourceMove = ChessMultiplayerComponent.getPointByCoords(i, j);
    return sourceMove.pointChar === this.sourceMove;
  }

  isXYInDestMove(i: number, j: number) {
    let destMove = ChessMultiplayerComponent.getPointByCoords(i, j);
    return destMove.pointChar === this.destMove;
  }

  startTimer() {
    if (!this.getIsGameFinished()) {
      if (this.isCurrentPlayer) {
        this.currentPlayerTime--;
        this.currentPlayerTimeString = new Date(this.currentPlayerTime * 1000).toISOString().substring(11, 19)
      } else {
        this.enemyPlayerTime--;
        this.enemyPlayerTimeString = new Date(this.enemyPlayerTime * 1000).toISOString().substring(11, 19);
      }
      setTimeout(() => this.startTimer(), 1000);
    }
  }

  isMobileView() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 768;
  }

  private checkForPat(color: Color) {
    this.checkForMate(color, 'Pat');
  }

}
