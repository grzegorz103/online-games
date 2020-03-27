package chess.api.services;

import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

@Service
public class PlayerServiceImpl {

    private final MazeServiceImpl mazeService;

    public PlayerServiceImpl(MazeServiceImpl mazeService) {
        this.mazeService = mazeService;
    }

    public Player getBySessionId(String sessionId) {
        Map<String, ? extends Maze> games = mazeService.getGames();
        return games.values()
                .stream()
                .flatMap(e -> e.getPlayers().stream())
                .filter(e -> Objects.equals(e.getSessionId(), sessionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
