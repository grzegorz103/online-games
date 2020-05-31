package chess.api.api.socket.events;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
public class SessionDisconnectListener implements ApplicationListener<SessionDisconnectEvent> {

    private final List<SessionHandler> sessionHandlers;

    public SessionDisconnectListener(List<SessionHandler> sessionHandlers) {
        this.sessionHandlers = sessionHandlers;
    }

    @Override
    public void onApplicationEvent(@NotNull SessionDisconnectEvent sessionDisconnectEvent) {
        this.sessionHandlers.forEach(e -> e.handleSessionDisconnect(sessionDisconnectEvent));
    }

}
