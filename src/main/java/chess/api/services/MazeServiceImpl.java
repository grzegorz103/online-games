package chess.api.services;

import chess.api.domain.Maze;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MazeServiceImpl {

    private Map<String, Maze> games = new HashMap<>();

    public void addGame(String uri, boolean[][] map) {
        games.put(uri, new Maze(map));
    }

}
