package chess.api.services;

import chess.api.domain.chess.Chess;
import chess.api.domain.chess.Player;
import chess.api.domain.chess.State;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ChessServiceImplTest {

    private ChessServiceImpl chessService;

    @BeforeEach
    public void init() {
        Map<String, Chess> games = new HashMap<>();
        games.put("test", new Chess(new Player("session", "", false), new Player("session2", "", false), Collections.emptyList(), false, State.RUNNING, 100));
        this.chessService = new ChessServiceImpl(games);
    }

    @Test
    void addGame() {
        Chess chess = chessService.addGame("test2", true, "session", 100);
        assertNotNull(chess);
        assertTrue(chessService.getGames().containsKey("test2"));
    }

    @Test
    void joinGame() {
        Chess chess = chessService.joinGame("test", "session");
        assertNotNull(chess);
        assertThat(chess.getBlackPlayer()).isNotNull();
        assertThat(chess.getWhitePlayer()).isNotNull();
    }

    @Test
    void getGames() {
        Map<?, ?> games = chessService.getGames();
        assertNotNull(games);
        assertThat(games.size()).isEqualTo(1);
    }

    @Test
    void getGameBySessionId() {
        Chess game = chessService.getGameBySessionId("session");
        assertThat(game).isNotNull();
    }

    @Test
    void getGameBySessionIdException() {
        assertThrows(Exception.class, () -> chessService.getGameBySessionId("test2"));
    }

    @Test
    void delete() {
        chessService.delete((Chess) chessService.getGames().values().toArray()[0]);
        assertThat(chessService.getGames()).isEmpty();
    }

}
