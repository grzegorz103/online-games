package chess.api.services;

import chess.api.domain.maze.Maze;
import chess.api.domain.maze.Player;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PlayerServiceImplTest {

    private PlayerServiceImpl playerService;

    @BeforeEach
    void init() {
        Map<String, Maze> gameMap = new HashMap<>();
        gameMap.put("test", new Maze(null, new HashSet<Player>(Arrays.asList(new Player("test", null, null))), null, null));
        this.playerService = new PlayerServiceImpl(new MazeServiceImpl(gameMap));
    }

    @Test
    void getBySessionId() {
        Player test = playerService.getBySessionId("test");

        assertThat(test).isNotNull();
    }

}
