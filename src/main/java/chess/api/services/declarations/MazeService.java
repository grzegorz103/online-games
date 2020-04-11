package chess.api.services.declarations;

import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import chess.api.domain.maze.Point;

import java.util.Map;
import java.util.Set;

public interface MazeService {

    Maze addGame(String uri, Point[][] map, String sessionId, int row, int col, String username);

    Maze getByURI(String uri);

    Maze joinGame(String uri, String sessionId, String username);

    Set<? extends Player> getPlayersByGame(String uri);

    Maze makeMove(String uri, String sessionId, int move);

    void removePlayer(String sessionId);

    Set<Maze> getGamesByPlayer(String sessionId);

    Map<String, ? extends Maze> getGames();

    void removeInactiveGames();

    String getAvailableUri();

}
