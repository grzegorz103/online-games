package chess.api.api.socket.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public abstract class SessionHandler {

    protected SimpMessageSendingOperations sendingOperations;

    @Autowired
    public SessionHandler(SimpMessageSendingOperations sendingOperations){
        this.sendingOperations = sendingOperations;
    }

    abstract void handleSessionDisconnect(SessionDisconnectEvent sessionDisconnectEvent);

}
