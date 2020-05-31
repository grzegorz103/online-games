package chess.api.api.socket;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Message;
import chess.api.domain.maze.Player;
import chess.api.domain.maze.Point;
import chess.api.services.MazeServiceImpl;
import chess.api.utils.URIGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
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

    @MessageMapping("/message/{row}/{col}/{username}")
    public void createGame(@DestinationVariable int row,
                           @DestinationVariable int col,
                           @Payload Point[][] points,
                           @DestinationVariable String username,
                           @Header("simpSessionId") String sessionId) throws Exception {
        String uri = URIGenerator.getAvailableURI(mazeService.getGames());
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/uri", uri, WebSocketUtils.getMessageHeaders(sessionId));
        Maze maze = mazeService.addGame(uri, points, sessionId, row, col, username);
        sendPlayers(maze, uri, null);
    }

    @MessageMapping("/message/{uri}/{username}/join")
    public void joinGame(@DestinationVariable String uri,
                         @DestinationVariable String username,
                         @Header("simpSessionId") String sessionId) {
        Maze maze = mazeService.joinGame(uri, sessionId, username);
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/map", maze.getPoints(), WebSocketUtils.getMessageHeaders(sessionId));
        messagingTemplate.convertAndSendToUser(sessionId, "/queue/meta", maze.getMeta(), WebSocketUtils.getMessageHeaders(sessionId));
        maze.getPlayers().forEach(e -> messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/dm", new Message(username + " dolacza do gry"), WebSocketUtils.getMessageHeaders(e.getSessionId())));
        sendPlayers(maze, uri, sessionId);
    }

    @MessageMapping("/message/{uri}/move/{move}")
    public void makeMove(@DestinationVariable String uri,
                         @Header("simpSessionId") String sessionId,
                         @DestinationVariable("move") int move) {
        Maze maze = mazeService.makeMove(uri, sessionId, move);
        sendPlayers(maze, uri, sessionId);
        if (maze.getWinner() != null) {
            maze.getPlayers().forEach(e -> messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/win", maze.getWinner(), WebSocketUtils.getMessageHeaders(e.getSessionId())));
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
                    messagingTemplate.convertAndSendToUser(e.getSessionId(), "/queue/reply", maze.getPlayers(), WebSocketUtils.getMessageHeaders(e.getSessionId()));
                });
            }
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {

    }

}
