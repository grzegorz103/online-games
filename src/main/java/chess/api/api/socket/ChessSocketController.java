package chess.api.api.socket;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.chess.Chess;
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

    @MessageMapping("/chess/host")
    public void createGame(@Payload boolean whiteStarts,
                           @Header("simpSessionId") String sessionId) {
        String uri = URIGenerator.getAvailableURI(chessService.getGames());
  log.info("Creating game with uri " + uri);
        Chess chess = chessService.addGame(uri, whiteStarts, sessionId);
        sendingOperations.convertAndSendToUser(sessionId, "/queue/chess/uri", uri, WebSocketUtils.getMessageHeaders(sessionId));
        sendingOperations.convertAndSendToUser(sessionId, "/queue/chess/create", chess, WebSocketUtils.getMessageHeaders(sessionId));
    }

    @MessageMapping("/chess/{uri}/join")
    public void joinGame(@Header("simpSessionId") String sessionId,
                         @DestinationVariable String uri) {
        log.info("Joining game with uri " + uri);
        chessService.joinGame(uri, sessionId);
    }

    @MessageMapping("/chess/{uri}/move/{move}")
    public void makeMove(@Header("simpSessionId") String sessionId,
                         @DestinationVariable String uri,
                         @DestinationVariable String move) {
        Chess chess = chessService.makeMove(uri, sessionId, move);
        sendingOperations.convertAndSendToUser(chess.getWhitePlayer().getSessionId(), "/queue/chess/move", chess.getLastMoveHistory(), WebSocketUtils.getMessageHeaders(chess.getWhitePlayer().getSessionId()));
        sendingOperations.convertAndSendToUser(chess.getBlackPlayer().getSessionId(), "/queue/chess/move", chess.getLastMoveHistory(), WebSocketUtils.getMessageHeaders(chess.getBlackPlayer().getSessionId()));
    }

}
