package chess.api.services;

import chess.api.domain.Maze;
import chess.api.domain.Point;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MazeServiceImpl {

    private Map<String, Maze> games = new HashMap<>();

    public void addGame(String uri, Point[][] map) {
        games.put(uri, new Maze(map));
    }

    public Maze getByURI(String uri) {
        return games.get("uri");
    }

}
