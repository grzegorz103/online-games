import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {Color} from "./models/pieces/color";
import {King} from "./models/pieces/king";
import {Point} from "./models/point";
import {Piece} from "./models/pieces/piece";
import {Pawn} from "./models/pieces/pawn";
import {Rook} from "./models/pieces/rook";
import {Knight} from "./models/pieces/knight";
import {Bishop} from "./models/pieces/bishop";
import {Queen} from "./models/pieces/queen";
import * as Stomp from 'stompjs';
import {environment} from "../../environments/environment";
import {ChessPromoteDialogComponent} from "../chess-promote-dialog/chess-promote-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Timer} from "./models/timer";
import {MessageproviderService} from "./services/messageprovider.service";
import {AvailableMoveDecoratorImpl} from "./models/pieces/decorator/available-move-decorator-impl";
import {MoveUtils} from "./utils/move-utils";
import {PieceFactoryService} from "./services/piece-factory.service";
import {WebsocketManager} from "./websocket/websocket-manager";
import {MoveHistoryProviderService} from "./services/move-history-provider.service";
import {MoveHistory} from "./models/move-history";
import {MoveHistoryFormatterService} from "./services/move-history-formatter.service";
import {UnicodeConstants} from "./utils/unicode-constants";

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
  static enPassantPoint: Point = null;
  static enPassantable: Point = null;
  static isWhiteBottom: boolean;
  static isGameFinished: boolean = false;
  static isCurrentPlayer = false;

  private selected: any;
  private whiteKingChecked: boolean;
  private blackKingChecked: boolean;
  private promotionResult: number;
  private destMove: string;
  private sourceMove: string;

  isLoading: boolean = false;
  playersReady: boolean = false;
  calculation: number;
  colorChoosen: boolean = false;
  abandoned: boolean = false;
  boardClone: string;
  availableTimes = [60, 180, 300];
  timeChoosen: number;
  isRotated: boolean = false;
  timeInterval: any;
  message: string;
  timer: Timer;
  sessionId: string;
  webSocketManager: WebsocketManager;

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              private pieceFactory: PieceFactoryService,
              public messageproviderService: MessageproviderService,
              public moveHistoryProviderService: MoveHistoryProviderService,
              private moveHistoryFormatter: MoveHistoryFormatterService,
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

      that.webSocketManager = new WebsocketManager(that.ws);

      that.webSocketManager
        .register("/errors", (message) => alert("Error " + message.body))
        .register("/user/queue/chess/message", (message) => that.messageproviderService.addMessage(JSON.parse(message.body)))
        .register("/user/queue/chess/sessionId", (message) => that.sessionId = message.body)
        .register("/user/queue/chess/move", (message) => that.movePiece(message.body))
        .register("/user/queue/chess/abandon", (message) => that.abandoned = true)
        .register("/user/queue/chess/resign", message => ChessMultiplayerComponent.isGameFinished = true)
        .register("/user/queue/chess/time", message => that.timeChoosen = JSON.parse(message.body))
        .register("/user/queue/chess/update", message => {
          ChessMultiplayerComponent.currentColor = ChessMultiplayerComponent.currentColor === Color.BLACK ? Color.WHITE : Color.BLACK;
          that.addPieces();
        }).register("/user/queue/chess/start", message => {
        that.isLoading = false;
        that.playersReady = true;
        ChessMultiplayerComponent.currentColor = (JSON.parse(message.body)) ? Color.WHITE : Color.BLACK;
        that.addPieces();
        that.calculateAdvantage();
      });

      that.ws.send("/app/chess/" + ChessMultiplayerComponent.uri + '/join', {}, true);
    }, function (error) {
      that.socket.close();
    });
  }

  movePiece(coords0: string) {
    ChessMultiplayerComponent.isCurrentPlayer = !ChessMultiplayerComponent.isCurrentPlayer;
    this.boardClone = JSON.stringify(ChessMultiplayerComponent.board);
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

      this.moveHistoryProviderService.addMove(new MoveHistory(this.moveHistoryFormatter.format(coords0)));

      this.whiteKingChecked = ChessMultiplayerComponent.isKingInCheck(Color.WHITE);
      if (this.whiteKingChecked) {
        // mat biale
        this.checkForMate(Color.WHITE, 'Szach mat! Czarne wygrały');
      } else {
        this.checkForPat(Color.WHITE);
      }

      this.blackKingChecked = ChessMultiplayerComponent.isKingInCheck(Color.BLACK);

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

  static isKingInCheck(color: Color): boolean {
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

      that.webSocketManager = new WebsocketManager(that.ws);

      that.webSocketManager
        .register("/errors", (message) => alert("Error " + message.body))
        .register("/user/queue/chess/uri", message => {
          ChessMultiplayerComponent.uri = message.body;
          that.isLoading = false;
          that.playersReady = false;
        }).register("/user/queue/chess/sessionId", message => that.sessionId = message.body)
        .register("/user/queue/chess/message", message => that.messageproviderService.addMessage(JSON.parse(message.body)))
        .register("/user/queue/chess/abandon", message => that.abandoned = true)
        .register("/user/queue/chess/resign", message => ChessMultiplayerComponent.isGameFinished = true)
        .register("/user/queue/chess/update", message => {
          ChessMultiplayerComponent.currentColor = ChessMultiplayerComponent.currentColor === Color.BLACK ? Color.WHITE : Color.BLACK;
          that.addPieces();
        }).register("/user/queue/chess/start", message => {
        that.isLoading = false;
        that.playersReady = true;
        ChessMultiplayerComponent.currentColor = (JSON.parse(message.body)) ? Color.WHITE : Color.BLACK;
        that.addPieces();
        that.calculateAdvantage();
      }).register("/user/queue/chess/move", message => that.movePiece(message.body));

    }, function (error) {
      that.socket.close();
    });
  }

  isCurrentWhiteColor() {
    return ChessMultiplayerComponent.currentColor === Color.WHITE;
  }

  async onMouseDown(event) {
    if (!ChessMultiplayerComponent.isCurrentPlayer || ChessMultiplayerComponent.isGameFinished) {
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
        this.activePoint = pointClicked;
        this.possibleCaptures = new AvailableMoveDecoratorImpl(pointClicked.piece, pointClicked).getPossibleCaptures();
        this.possibleMoves = new AvailableMoveDecoratorImpl(pointClicked.piece, pointClicked).getPossibleMoves();
        this.selected = true;
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
    this.timer = new Timer(this.timeChoosen);
    this.blackKingChecked = false;
    this.whiteKingChecked = false;
    this.sourceMove = '';
    this.destMove = '';
    if (ChessMultiplayerComponent.currentColor === Color.WHITE) {
      ChessMultiplayerComponent.isCurrentPlayer = true;
      ChessMultiplayerComponent.isWhiteBottom = true;
    } else {
      ChessMultiplayerComponent.isCurrentPlayer = false;
      ChessMultiplayerComponent.isWhiteBottom = false;
    }
    if (ChessMultiplayerComponent.currentColor === Color.BLACK) {
      let c = 1;
      ChessMultiplayerComponent.isCurrentPlayer = false;
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
        ChessMultiplayerComponent.getPointByCoords(1, i).piece = new Pawn(Color.WHITE, 'pawn-white.png', UnicodeConstants.WHITE_PAWN);
        --cw;
      }
      ChessMultiplayerComponent.getPointByCoords(0, 0).piece = new Rook(Color.WHITE, 'rook-white.png',UnicodeConstants.WHITE_ROOK);
      ChessMultiplayerComponent.getPointByCoords(0, 1).piece = new Knight(Color.WHITE, 'knight-white.png', UnicodeConstants.WHITE_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(0, 2).piece = new Bishop(Color.WHITE, 'bishop-white.png', UnicodeConstants.WHITE_BISHOP);
      ChessMultiplayerComponent.getPointByCoords(0, 3).piece = new King(Color.WHITE, 'king-white.png', UnicodeConstants.WHITE_KING);
      ChessMultiplayerComponent.getPointByCoords(0, 4).piece = new Queen(Color.WHITE, 'queen-white.png', UnicodeConstants.WHITE_QUEEN);
      ChessMultiplayerComponent.getPointByCoords(0, 5).piece = new Bishop(Color.WHITE, 'bishop-white.png', UnicodeConstants.WHITE_BISHOP);
      ChessMultiplayerComponent.getPointByCoords(0, 6).piece = new Knight(Color.WHITE, 'knight-white.png', UnicodeConstants.WHITE_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(0, 7).piece = new Rook(Color.WHITE, 'rook-white.png', UnicodeConstants.WHITE_ROOK);

      let cz = 104;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.getPointByCoords(6, i).piece = new Pawn(Color.BLACK, 'pawn-black.png', UnicodeConstants.BLACK_PAWN);
        --cz;
      }
      ChessMultiplayerComponent.getPointByCoords(7, 0).piece = new Rook(Color.BLACK, 'rook-black.png', UnicodeConstants.BLACK_ROOK);
      ChessMultiplayerComponent.getPointByCoords(7, 1).piece = new Knight(Color.BLACK, 'knight-black.png', UnicodeConstants.BLACK_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(7, 2).piece = new Bishop(Color.BLACK, 'bishop-black.png', UnicodeConstants.BLACK_BISHOP);
      ChessMultiplayerComponent.getPointByCoords(7, 3).piece = new King(Color.BLACK, 'king-black.png', UnicodeConstants.BLACK_KING);
      ChessMultiplayerComponent.getPointByCoords(7, 4).piece = new Queen(Color.BLACK, 'queen-black.png', UnicodeConstants.BLACK_QUEEN);
      ChessMultiplayerComponent.getPointByCoords(7, 5).piece = new Bishop(Color.BLACK, 'bishop-black.png', UnicodeConstants.BLACK_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(7, 6).piece = new Knight(Color.BLACK, 'knight-black.png', UnicodeConstants.BLACK_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(7, 7).piece = new Rook(Color.BLACK, 'rook-black.png', UnicodeConstants.BLACK_ROOK);

    } else {
      ChessMultiplayerComponent.isCurrentPlayer = true;
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
        ChessMultiplayerComponent.getPointByCoords(1, i).piece = new Pawn(Color.BLACK, 'pawn-black.png', UnicodeConstants.BLACK_PAWN);
        ++cx;
      }

      ChessMultiplayerComponent.getPointByCoords(0, 0).piece = new Rook(Color.BLACK, 'rook-black.png', UnicodeConstants.BLACK_ROOK);
      ChessMultiplayerComponent.getPointByCoords(0, 1).piece = new Knight(Color.BLACK, 'knight-black.png', UnicodeConstants.BLACK_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(0, 2).piece = new Bishop(Color.BLACK, 'bishop-black.png', UnicodeConstants.BLACK_BISHOP);
      ChessMultiplayerComponent.getPointByCoords(0, 3).piece = new Queen(Color.BLACK, 'queen-black.png', UnicodeConstants.BLACK_QUEEN);
      ChessMultiplayerComponent.getPointByCoords(0, 4).piece = new King(Color.BLACK, 'king-black.png', UnicodeConstants.BLACK_KING);
      ChessMultiplayerComponent.getPointByCoords(0, 5).piece = new Bishop(Color.BLACK, 'bishop-black.png', UnicodeConstants.BLACK_BISHOP);
      ChessMultiplayerComponent.getPointByCoords(0, 6).piece = new Knight(Color.BLACK, 'knight-black.png', UnicodeConstants.BLACK_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(0, 7).piece = new Rook(Color.BLACK, 'rook-black.png', UnicodeConstants.BLACK_ROOK);

      let x = 97;
      for (let i = 0; i < 8; ++i) {
        ChessMultiplayerComponent.getPointByCoords(6, i).piece = new Pawn(Color.WHITE, 'pawn-white.png', UnicodeConstants.WHITE_PAWN);
        ++x;
      }

      ChessMultiplayerComponent.getPointByCoords(7, 0).piece = new Rook(Color.WHITE, 'rook-white.png', UnicodeConstants.WHITE_ROOK);
      ChessMultiplayerComponent.getPointByCoords(7, 1).piece = new Knight(Color.WHITE, 'knight-white.png', UnicodeConstants.WHITE_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(7, 2).piece = new Bishop(Color.WHITE, 'bishop-white.png', UnicodeConstants.WHITE_BISHOP);
      ChessMultiplayerComponent.getPointByCoords(7, 3).piece = new Queen(Color.WHITE, 'queen-white.png', UnicodeConstants.WHITE_QUEEN);
      ChessMultiplayerComponent.getPointByCoords(7, 4).piece = new King(Color.WHITE, 'king-white.png', UnicodeConstants.WHITE_KING);
      ChessMultiplayerComponent.getPointByCoords(7, 5).piece = new Bishop(Color.WHITE, 'bishop-white.png', UnicodeConstants.WHITE_BISHOP);
      ChessMultiplayerComponent.getPointByCoords(7, 6).piece = new Knight(Color.WHITE, 'knight-white.png', UnicodeConstants.WHITE_KNIGHT);
      ChessMultiplayerComponent.getPointByCoords(7, 7).piece = new Rook(Color.WHITE, 'rook-white.png', UnicodeConstants.WHITE_ROOK);
    }

    this.calculateAdvantage();
    //  this.startTimer();
    this.timer.start();
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
      return point.piece.getPossibleMoves().every(e => MoveUtils.willMoveCauseCheck(point.piece.color, point.row, point.col, e.row, e.col))
        && point.piece.getPossibleCaptures().every(e => MoveUtils.willMoveCauseCheck(point.piece.color, point.row, point.col, e.row, e.col))
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
      srcPoint.piece = this.pieceFactory.getPiece(promotionChose, srcPoint.piece.color);
    }
  }

  rotateBoard() {
    ChessMultiplayerComponent.isWhiteBottom = !ChessMultiplayerComponent.isWhiteBottom;
    this.isRotated = !this.isRotated;

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
    if (!this.timeChoosen || !ChessMultiplayerComponent.currentColor === undefined) {
      let config = new MatSnackBarConfig();
      config.verticalPosition = 'bottom';
      config.horizontalPosition = 'center';
      config.duration = 2000;
      config.panelClass = ['warning-bar'];
      this.snackBar.open('Wybierz kolor i czas!', null, config);
      return;
    }
    this.colorChoosen = true;
    this.isLoading = true;
    this.waitForSocketConnection();
  }

  waitForSocketConnection() {
    setTimeout(() => {
      if (this.socket.readyState === 1) {
        console.log('Connection established');
        this.ws.send("/app/chess/host/" + this.timeChoosen, {}, ChessMultiplayerComponent.currentColor === Color.WHITE);
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


  isMobileView() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 768;
  }

  private checkForPat(color: Color) {
    this.checkForMate(color, 'Pat');
  }

  restore() {
    ChessMultiplayerComponent.board = JSON.parse(this.boardClone);
  }

  sendMessage() {
    if (this.message) {
      this.ws.send("/app/chess/message/" + this.getUri(), {}, this.message);
      this.message = '';
    }
  }

  resign() {
    this.ws.send("/app/chess/resign/" + this.getUri(), {}, this.message);
  }

}
