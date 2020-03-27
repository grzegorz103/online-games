package chess.api.api.socket;

import chess.api.domain.maze.Message;
import chess.api.domain.maze.Player;
import chess.api.services.MazeServiceImpl;
import chess.api.services.MessageServiceImpl;
import chess.api.services.PlayerServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
public class MessageSocketController {

    private final MessageServiceImpl messageService;

    private final MazeServiceImpl mazeService;

    private final PlayerServiceImpl playerService;

    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public MessageSocketController(MessageServiceImpl messageService, MazeServiceImpl mazeService, SimpMessageSendingOperations messagingTemplate, PlayerServiceImpl playerService) {
        this.messageService = messageService;
        this.mazeService = mazeService;
        this.messagingTemplate = messagingTemplate;
        this.playerService = playerService;
    }

    @MessageMapping("/message/{uri}/send")
    public void processMessage(@Payload Message message,
                               @DestinationVariable String uri,
                               @Header("simpSessionId") String sessionId) {
        Set<? extends Player> playersByGame = mazeService.getPlayersByGame(uri);
        message.setMessage(playerService.getBySessionId(sessionId).getUsername() + ": " + message.getMessage());
        playersByGame.forEach(e -> messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/dm", message, getMessageHeaders(e.getSessionId())));
    }

    private MessageHeaders getMessageHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor
                .create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        headerAccessor.addNativeHeader("any", "any");
        return headerAccessor.getMessageHeaders();
    }

}
