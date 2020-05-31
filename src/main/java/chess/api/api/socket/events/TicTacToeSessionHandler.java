package chess.api.api.socket.events;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.ticTacToe.Game;
import chess.api.services.declarations.TicTacToeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;

@Component
public class TicTacToeSessionHandler extends SessionHandler {

    private final TicTacToeService ticTacToeService;

    public TicTacToeSessionHandler(SimpMessageSendingOperations sendingOperations,
                                   TicTacToeService ticTacToeService) {
        super(sendingOperations);
        this.ticTacToeService = ticTacToeService;
    }

    @Override
    void handleSessionDisconnect(SessionDisconnectEvent sessionDisconnectEvent) {
        String sessionId = sessionDisconnectEvent.getSessionId();
        Game playersGame = ticTacToeService.getByPlayerSessionId(sessionId);
        ticTacToeService.abandonGame(sessionId);
        if (Objects.equals(playersGame.getOPlayer().getSessionId(), sessionId))
            sendingOperations.convertAndSendToUser(playersGame.getXPlayer().getSessionId(), "/queue/tic", playersGame, WebSocketUtils.getMessageHeaders(playersGame.getXPlayer().getSessionId()));
        else
            sendingOperations.convertAndSendToUser(playersGame.getOPlayer().getSessionId(), "/queue/tic", playersGame, WebSocketUtils.getMessageHeaders(playersGame.getOPlayer().getSessionId()));
    }
}
