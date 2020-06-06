package chess.api.api.socket.events.game;

import chess.api.api.socket.events.game.GameSessionHandler;
import chess.api.services.declarations.PublicChatService;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class PublicChatSessionHandler extends GameSessionHandler {

    private PublicChatService chatService;

    public PublicChatSessionHandler(SimpMessageSendingOperations sendingOperations,
                                    PublicChatService publicChatService) {
        super(sendingOperations);
        this.chatService = publicChatService;
    }

    @Override
    public void handleSessionDisconnect(SessionDisconnectEvent sessionDisconnectEvent) {
        chatService.removeMember(sessionDisconnectEvent.getSessionId());
        sendingOperations.convertAndSend("/queue/public/chat/users", chatService.getMembers());
    }

}
