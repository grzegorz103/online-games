package chess.api.api.socket;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.maze.Maze;
import chess.api.domain.publicChat.Member;
import chess.api.domain.publicChat.Message;
import chess.api.services.PublicChatServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;

@Controller
public class PublicChatController {

    private final SimpMessageSendingOperations messagingTemplate;

    private final PublicChatServiceImpl chatService;

    public PublicChatController(SimpMessageSendingOperations messagingTemplate,
                                PublicChatServiceImpl chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/public/chat/{username}/join")
    @SendTo("/topic/public/chat")
    public Message joinChat(@DestinationVariable String username,
                            @Header("simpSessionId") String sessionId) {
        chatService.addMember(new Member(sessionId, username));
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/public/chat/id", sessionId, WebSocketUtils.getMessageHeaders(sessionId));
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/public/chat/users", chatService.getMembers(), WebSocketUtils.getMessageHeaders(sessionId));
        return new Message(username + " dolacza do chatu", LocalDate.now(), null);
    }

    @MessageMapping("/public/chat/send")
    @SendTo("/topic/public/chat")
    public Message sendMessage(Message message,
                               @Header("simpSessionId") String sessionId) {
        message.setAuthorSessionId(sessionId);
        return message;
    }

    @EventListener
    @SendTo("/topic/public/users")
    public Set<Member> handleSessionDisconnect(SessionDisconnectEvent event) {
        chatService.removeMember(event.getSessionId());
        return chatService.getMembers();
    }

}
