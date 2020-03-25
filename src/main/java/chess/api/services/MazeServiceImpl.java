package chess.api.services;

import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import chess.api.domain.maze.Point;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class MazeServiceImpl {

    private Map<String, Maze> games = new HashMap<>();

    public void addGame(String uri, Point[][] map, String sessionId) {
        Maze maze = new Maze(map);
        maze.addPlayer(new Player(sessionId, new Point(0, 0, false)));
        games.put(uri, maze);
        System.out.println("DODANO ");
    }

    public Maze getByURI(String uri) {
        return games.get("uri");
    }

    public Maze joinGame(String uri, String sessionId) {
        Maze maze = games.get(uri);
        System.out.println("DOLACZANIE " + maze);
        if (maze != null) {
            maze.addPlayer(new Player(sessionId, new Point(0, 0, false)));
        }

        return maze;
    }


    public Set<? extends Player> getPlayersByGame(String uri) {
        Maze maze = games.get(uri);
        System.out.println(maze);
        if (maze != null) {
            return maze.getPlayers();
        }

        return null;
    }
}
