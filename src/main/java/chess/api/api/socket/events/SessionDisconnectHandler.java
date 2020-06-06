package chess.api.api.socket.events;

import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public interface SessionDisconnectHandler {

    void handleSessionDisconnect(SessionDisconnectEvent sessionDisconnectEvent);

}
