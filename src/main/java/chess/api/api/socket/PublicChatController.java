package chess.api.api.socket;

import chess.api.domain.publicChat.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.util.Map;

@Controller
public class PublicChatController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/public/chat/{username}/join")
    @SendTo("/topic/public/chat")
    public Message joinChat(@DestinationVariable String username,
                            @Header("simpSessionId") String sessionId) {
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/public/chat/id", sessionId, getMessageHeaders(sessionId));
        return new Message(username + " dolacza do chatu", LocalDate.now(), null);
    }

    private MessageHeaders getMessageHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor
                .create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        headerAccessor.addNativeHeader("any", "any");
        return headerAccessor.getMessageHeaders();
    }

    @MessageMapping("/public/chat/send")
    @SendTo("/topic/public/chat")
    public Message sendMessage(Message message,
                               @Header("simpSessionId") String sessionId) {
        message.setAuthorSessionId(sessionId);
        return message;
    }

}
