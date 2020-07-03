package chess.api.services;

import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import chess.api.domain.ticTacToe.Game;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MazeServiceImplTest {

    private MazeServiceImpl mazeService;

    @BeforeEach
    void init() {
        Map<String, Maze> gameMap = new HashMap<>();
        gameMap.put("test", new Maze(null, new HashSet<Player>(Arrays.asList(new Player("test", null, null))), null, null));
        this.mazeService = new MazeServiceImpl(gameMap);
    }

    @Test
    void addGame() {
        final int currentSize = 1;
        Maze maze = mazeService.addGame("test2", null, "session", 1, 1, "user");

        assertThat(maze).isNotNull();
        assertThat(mazeService.getGames().size()).isEqualTo(currentSize + 1);
    }

    @Test
    void getByURI() {
        Maze test = mazeService.getByURI("test");

        assertThat(test).isNotNull();
    }

    @Test
    void getGamesByPlayer() {
        Set<Maze> session = mazeService.getGamesByPlayer("test");

        assertThat(session).isNotNull();
        assertThat(session).isNotEmpty();
        assertThat(session.size()).isEqualTo(1);
    }

    @Test
    void getGames() {
        Map<String, ? extends Maze> games = mazeService.getGames();

        assertThat(games).isNotNull();
        assertThat(games.size()).isEqualTo(1);
    }
}
