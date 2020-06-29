package chess.api.api.socket.events.game;

import chess.api.api.socket.events.SessionDisconnectCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

public abstract class GameSessionHandler implements SessionDisconnectCallback {

    protected SimpMessageSendingOperations sendingOperations;

    @Autowired
    public GameSessionHandler(SimpMessageSendingOperations sendingOperations) {
        this.sendingOperations = sendingOperations;
    }

}
