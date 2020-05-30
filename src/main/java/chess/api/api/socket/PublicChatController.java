package chess.api.api.socket;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.publicChat.Member;
import chess.api.domain.publicChat.Message;
import chess.api.services.PublicChatServiceImpl;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.Instant;

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
        Member member = new Member(sessionId, username);
        chatService.addMember(member);
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/public/chat/id", member.getRandomId(), WebSocketUtils.getMessageHeaders(sessionId));
        messagingTemplate.convertAndSend("/queue/public/chat/users", chatService.getMembers());
        return new Message(username + " dołącza do chatu", Instant.now(), member.getRandomId(), username);
    }

    @MessageMapping("/public/chat/send")
    @SendTo("/topic/public/chat")
    public Message sendMessage(@Payload Message message,
                               @Header("simpSessionId") String sessionId) {
        return chatService.processMessage(message, sessionId);
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        chatService.removeMember(event.getSessionId());
        messagingTemplate.convertAndSend("/queue/public/chat/users", chatService.getMembers());
    }

}
