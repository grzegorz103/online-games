package chess.api.api.socket;

import chess.api.domain.maze.Message;
import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import chess.api.domain.maze.Point;
import chess.api.services.MazeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;

@Controller
public class MazeSocketController {

    private final SimpMessageSendingOperations messagingTemplate;

    private final MazeServiceImpl mazeService;

    @Autowired
    public MazeSocketController(SimpMessageSendingOperations messagingTemplate, MazeServiceImpl mazeService) {
        this.messagingTemplate = messagingTemplate;
        this.mazeService = mazeService;
    }

    @MessageMapping("/message/{uri}/{row}/{col}/{username}")
    //   @SendTo("/topic/reply")
    // dodac session id
    public void createGame(@DestinationVariable int row,
                           @DestinationVariable int col,
                           @Payload Point[][] points,
                           @DestinationVariable String uri,
                           @DestinationVariable String username,
                           @Header("simpSessionId") String sessionId) throws Exception {
        Maze maze = mazeService.addGame(uri, points, sessionId, row, col, username);
        sendPlayers(maze, uri, null);
    }

    @MessageMapping("/message/{uri}/{username}/join")
    public void joinGame(@DestinationVariable String uri,
                         @DestinationVariable String username,
                         @Header("simpSessionId") String sessionId) {
        Maze maze = mazeService.joinGame(uri, sessionId, username);
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/map", maze.getPoints(), getMessageHeaders(sessionId));
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/meta", maze.getMeta(), getMessageHeaders(sessionId));
        maze.getPlayers().forEach(e -> messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/dm", new Message(username + " dolacza do gry"), getMessageHeaders(e.getSessionId())));
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
