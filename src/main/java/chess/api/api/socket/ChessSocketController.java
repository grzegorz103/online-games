package chess.api.api.socket;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.chess.Chess;
import chess.api.domain.chess.Message;
import chess.api.services.declarations.ChessService;
import chess.api.utils.URIGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@Slf4j
public class ChessSocketController {

    private final ChessService chessService;

    private final SimpMessageSendingOperations sendingOperations;

    public ChessSocketController(ChessService chessService,
                                 SimpMessageSendingOperations sendingOperations) {
        this.chessService = chessService;
        this.sendingOperations = sendingOperations;
    }

    @MessageMapping("/chess/host/{time}")
    public void createGame(@Payload boolean whiteStarts,
                           @DestinationVariable("time") Integer time,
                           @Header("simpSessionId") String sessionId) {
        String uri = URIGenerator.getAvailableURI(chessService.getGames());
        log.info("Creating game with uri " + uri);
        Chess chess = chessService.addGame(uri, whiteStarts, sessionId, time);
        sendingOperations.convertAndSendToUser(sessionId, "/queue/chess/uri", uri, WebSocketUtils.getMessageHeaders(sessionId));
        sendingOperations.convertAndSendToUser(sessionId, "/queue/chess/create", chess, WebSocketUtils.getMessageHeaders(sessionId));
        sendingOperations.convertAndSendToUser(sessionId, "/queue/chess/sessionId", sessionId, WebSocketUtils.getMessageHeaders(sessionId));
    }

    @MessageMapping("/chess/{uri}/join")
    public void joinGame(@Header("simpSessionId") String sessionId,
                         @DestinationVariable String uri) {
        uri = uri.toUpperCase();
        log.info("Joining game with uri " + uri);
        Chess chess = chessService.joinGame(uri, sessionId);

        sendingOperations.convertAndSendToUser(sessionId, "/queue/chess/time", chess.getTime(), WebSocketUtils.getMessageHeaders(sessionId));
        sendingOperations.convertAndSendToUser(chess.getWhitePlayer().getSessionId(), "/queue/chess/start", true, WebSocketUtils.getMessageHeaders(chess.getWhitePlayer().getSessionId()));
        sendingOperations.convertAndSendToUser(chess.getBlackPlayer().getSessionId(), "/queue/chess/start", false, WebSocketUtils.getMessageHeaders(chess.getBlackPlayer().getSessionId()));
        sendingOperations.convertAndSendToUser(sessionId, "/queue/chess/sessionId", sessionId, WebSocketUtils.getMessageHeaders(sessionId));
    }

    @MessageMapping("/chess/{uri}/move/{move}")
    public void makeMove(@Header("simpSessionId") String sessionId,
                         @DestinationVariable String uri,
                         @DestinationVariable String move) {
        uri = uri.toUpperCase();
        Chess chess = chessService.makeMove(uri, sessionId, move);
        sendingOperations.convertAndSendToUser(chess.getWhitePlayer().getSessionId(), "/queue/chess/move", chess.getLastMoveHistory(), WebSocketUtils.getMessageHeaders(chess.getWhitePlayer().getSessionId()));
        sendingOperations.convertAndSendToUser(chess.getBlackPlayer().getSessionId(), "/queue/chess/move", chess.getLastMoveHistory(), WebSocketUtils.getMessageHeaders(chess.getBlackPlayer().getSessionId()));
    }

    @MessageMapping("/chess/{uri}/rematch")
    public void rematch(@Header("simpSessionId") String sessionId,
                        @DestinationVariable String uri) {
        uri = uri.toUpperCase();
        Chess game = chessService.rematch(uri, sessionId);
        log.info("Receive rematch request url " + uri);
        if (game.getBlackPlayer().isRematchSent() && game.getWhitePlayer().isRematchSent()) {
            chessService.resetGame(game);
            log.info("Reseting game with url " + uri);
            sendingOperations.convertAndSendToUser(game.getWhitePlayer().getSessionId(), "/queue/chess/update", true, WebSocketUtils.getMessageHeaders(game.getWhitePlayer().getSessionId()));
            sendingOperations.convertAndSendToUser(game.getBlackPlayer().getSessionId(), "/queue/chess/update", true, WebSocketUtils.getMessageHeaders(game.getBlackPlayer().getSessionId()));
        }
    }

    @MessageMapping("/chess/message/{uri}")
    public void sendMessage(@Header("simpSessionId") String sessionId,
                            @Payload String message,
                            @DestinationVariable String uri) {
        uri = uri.toUpperCase();
        log.info("Sending message to game " + uri);
        Chess game = chessService.getGameBySessionId(sessionId);
        if (game != null) {
            Message msg = new Message(message, sessionId, Instant.now());
            sendingOperations.convertAndSendToUser(game.getWhitePlayer().getSessionId(), "/queue/chess/message", msg, WebSocketUtils.getMessageHeaders(game.getWhitePlayer().getSessionId()));
            sendingOperations.convertAndSendToUser(game.getBlackPlayer().getSessionId(), "/queue/chess/message", msg, WebSocketUtils.getMessageHeaders(game.getBlackPlayer().getSessionId()));
        }
    }

    @MessageMapping("/chess/resign/{uri}")
    public void resign(@DestinationVariable String uri,
                       @Header("simpSessionId") String sessionId) {
        uri = uri.toUpperCase();
        log.info("Resign game at URI " + uri);
        Chess game = chessService.getGameBySessionId(sessionId);
        if (game != null) {
            sendingOperations.convertAndSendToUser(game.getWhitePlayer().getSessionId(), "/queue/chess/resign", true, WebSocketUtils.getMessageHeaders(game.getWhitePlayer().getSessionId()));
            sendingOperations.convertAndSendToUser(game.getBlackPlayer().getSessionId(), "/queue/chess/resign", true, WebSocketUtils.getMessageHeaders(game.getBlackPlayer().getSessionId()));
        }
    }

}
