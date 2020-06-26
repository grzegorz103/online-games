package chess.api.api.socket.events.game;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.chess.Chess;
import chess.api.services.declarations.ChessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;

@Component
public class ChessSessionHandler extends GameSessionHandler {

    private final ChessService chessService;

    @Autowired
    public ChessSessionHandler(SimpMessageSendingOperations sendingOperations, ChessService chessService) {
        super(sendingOperations);
        this.chessService = chessService;
    }

    @Override
    public void handleSessionDisconnect(SessionDisconnectEvent sessionDisconnectEvent) {
        String sessionId = sessionDisconnectEvent.getSessionId();
        Chess chess = chessService.getGameBySessionId(sessionId);
        chessService.delete(chess);
        if (Objects.equals(chess.getBlackPlayer().getSessionId(), sessionId)) {
            sendingOperations.convertAndSendToUser(chess.getWhitePlayer().getSessionId(), "/queue/chess/abandon", true, WebSocketUtils.getMessageHeaders(chess.getWhitePlayer().getSessionId()));
        } else {
            sendingOperations.convertAndSendToUser(chess.getBlackPlayer().getSessionId(), "/queue/chess/abandon", true, WebSocketUtils.getMessageHeaders(chess.getBlackPlayer().getSessionId()));
        }
    }

}
