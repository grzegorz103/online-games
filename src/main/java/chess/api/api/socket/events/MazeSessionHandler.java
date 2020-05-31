package chess.api.api.socket.events;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.maze.Maze;
import chess.api.services.declarations.MazeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;

@Component
public class MazeSessionHandler extends SessionHandler {

    private final MazeService mazeService;

    public MazeSessionHandler(MazeService mazeService,
                              SimpMessageSendingOperations sendingOperations) {
        super(sendingOperations);
        this.mazeService = mazeService;
    }

    @Override
    public void handleSessionDisconnect(SessionDisconnectEvent sessionDisconnectEvent) {
        Set<Maze> gamesByPlayer = mazeService.getGamesByPlayer(sessionDisconnectEvent.getSessionId());
        mazeService.removePlayer(sessionDisconnectEvent.getSessionId());
        if (gamesByPlayer != null) {
            gamesByPlayer.forEach(e -> e.getPlayers()
                    .forEach(f ->
                            sendingOperations.convertAndSendToUser(f.getSessionId(), "/queue/reply", e.getPlayers(), WebSocketUtils.getMessageHeaders(f.getSessionId()))
                    ));
        }
    }

}
