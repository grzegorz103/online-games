package chess.api.services;

import chess.api.domain.ticTacToe.Game;
import chess.api.domain.ticTacToe.Player;
import chess.api.services.declarations.TicTacToeService;
import chess.api.utils.Constants;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TicTacToeServiceImpl implements TicTacToeService {

    private final Map<String, Game> games = new ConcurrentHashMap<>();

    @Override
    public Game hostGame(String sessionId, String uri) {
        Game game = new Game();
        game.setXPlayer(new Player(sessionId, null));
        this.games.put(uri, game);
        return game;
    }

    @Override
    public Game joinGame(String uri, String sessionId) {
        Game game = this.games.get(uri);
        if (game != null) {
            game.setOPlayer(new Player(sessionId, null));
        }
        return game;
    }

    @Override
    public Game move(String uri, String sessionId, int move) {
        Game game = this.games.get(uri);
        if (game != null) {
            System.out.println(move + " " + sessionId);
            game.getMap()[move] = Objects.equals(game.getOPlayer().getSessionId(), sessionId)
                    ? Constants.X_PLAYER
                    : Constants.O_PLAYER;
            System.out.println(Arrays.toString(game.getMap()));
        }

        return game;
    }

    @Override
    public Map<String, ? extends Game> getGames() {
        return this.games;
    }

}
