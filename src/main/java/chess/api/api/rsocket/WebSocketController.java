package chess.api.api.rsocket;

import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import chess.api.domain.maze.Point;
import chess.api.services.MazeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;

@Controller
public class WebSocketController {

    private final SimpMessageSendingOperations messagingTemplate;

    private final MazeServiceImpl mazeService;

    @Autowired
    public WebSocketController(SimpMessageSendingOperations messagingTemplate, MazeServiceImpl mazeService) {
        this.messagingTemplate = messagingTemplate;
        this.mazeService = mazeService;
    }

    @MessageMapping("/message/{uri}/{row}/{col}")
    //   @SendTo("/topic/reply")
    // dodac session id
    public void createGame(@DestinationVariable int row,
                           @DestinationVariable int col,
                           @Payload Point[][] points,
                           @DestinationVariable String uri,
                           @Header("simpSessionId") String sessionId) throws Exception {
        Maze maze = mazeService.addGame(uri, points, sessionId, row, col);
        sendPlayers(maze, uri, null);
    }

    @MessageMapping("/message/{uri}/join")
    public void joinGame(@DestinationVariable String uri,
                         @Header("simpSessionId") String sessionId) {
        Maze maze = mazeService.joinGame(uri, sessionId);
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/map", maze.getPoints(), getMessageHeaders(sessionId));
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/meta", maze.getMeta(), getMessageHeaders(sessionId));
        sendPlayers(maze, uri, sessionId);
    }

    @MessageMapping("/message/{uri}/move/{move}")
    public void makeMove(@DestinationVariable String uri,
                         @Header("simpSessionId") String sessionId,
                         @DestinationVariable("move") int move) {
        Maze maze = mazeService.makeMove(uri, sessionId, move);
        sendPlayers(maze, uri, sessionId);
        if (maze.getWinner() != null) {
            maze.getPlayers().forEach(e -> messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/win", maze.getWinner(), getMessageHeaders(e.getSessionId())));
        }
    }

    @MessageExceptionHandler
    public String handleException(Throwable exception) {
        messagingTemplate.convertAndSend("/errors", exception.getMessage());
        return exception.getMessage();
    }

    private void sendPlayers(Maze maze, String uri, String sessionId) {
        if (maze != null) {
            Set<? extends Player> players = mazeService.getPlayersByGame(uri);
            if (players != null) {
                players.forEach(e -> {
                    messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/reply", maze.getPlayers(), getMessageHeaders(e.getSessionId()));
                });
            }
        }
    }

    private MessageHeaders getMessageHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor
                .create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        headerAccessor.addNativeHeader("any", "any");
        return headerAccessor.getMessageHeaders();
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        Set<Maze> gamesByPlayer = mazeService.getGamesByPlayer(event.getSessionId());
        mazeService.removePlayer(event.getSessionId());
        if (gamesByPlayer != null) {
            gamesByPlayer.forEach(e -> e.getPlayers()
                    .forEach(f ->
                            messagingTemplate.convertAndSendToUser(f.getSessionId(), "/queue/reply", e.getPlayers(), getMessageHeaders(f.getSessionId()))
                    ));
        }
    }

}
