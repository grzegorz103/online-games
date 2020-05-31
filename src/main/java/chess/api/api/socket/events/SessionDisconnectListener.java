package chess.api.api.socket.events;

import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
@Slf4j
public class SessionDisconnectListener implements ApplicationListener<SessionDisconnectEvent> {

    private final List<SessionHandler> sessionHandlers;

    public SessionDisconnectListener(List<SessionHandler> sessionHandlers) {
        this.sessionHandlers = sessionHandlers;
    }

    @Override
    public void onApplicationEvent(@NotNull SessionDisconnectEvent sessionDisconnectEvent) {
        for (SessionHandler e : this.sessionHandlers) {
            try {
                e.handleSessionDisconnect(sessionDisconnectEvent);
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }
        }
    }

}
