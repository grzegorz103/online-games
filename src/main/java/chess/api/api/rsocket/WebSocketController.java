package chess.api.api.rsocket;

import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import chess.api.domain.maze.Point;
import chess.api.services.MazeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.Set;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private MazeServiceImpl mazeService;

    @MessageMapping("/message/{uri}")
    //   @SendTo("/topic/reply")
    // dodac session id
    public void createGame(Message<Point[][]> points,
                           @DestinationVariable String uri) throws Exception {
        System.out.println(uri);
        mazeService.addGame(uri, points.getPayload(), String.valueOf(points.getHeaders().get("simpSessionId")));
    }

    @MessageMapping("/message/{uri}/join")
    public void joinGame(@DestinationVariable String uri,
                         @Header("simpSessionId") String sessionId) {
        Maze maze = mazeService.joinGame(uri, sessionId);
        if (maze != null) {
            Set<? extends Player> players = mazeService.getPlayersByGame(uri);
            if (players != null) {
                players.forEach(e -> {
                    System.out.println(e);
                    SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor
                            .create(SimpMessageType.MESSAGE);
                    headerAccessor.setSessionId(e.getSessionId());
                    headerAccessor.setLeaveMutable(true);headerAccessor.addNativeHeader("any", "any");
                    messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/reply", maze, headerAccessor.getMessageHeaders());
                });
                messagingTemplate.convertAndSendToUser(sessionId, "/topic/map", maze.getPoints());
            }
        }
    }

    @MessageExceptionHandler
    public String handleException(Throwable exception) {
        messagingTemplate.convertAndSend("/errors", exception.getMessage());
        return exception.getMessage();
    }

}
