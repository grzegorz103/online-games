package chess.api.api.socket.events;

import chess.api.services.declarations.PublicChatService;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class PublicChatSessionHandler extends SessionHandler {

    private PublicChatService chatService;

    public PublicChatSessionHandler(SimpMessageSendingOperations sendingOperations,
                                    PublicChatService publicChatService) {
        super(sendingOperations);
        this.chatService = publicChatService;
    }

    @Override
    void handleSessionDisconnect(SessionDisconnectEvent sessionDisconnectEvent) {

    }
}
