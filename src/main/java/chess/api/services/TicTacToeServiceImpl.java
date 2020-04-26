package chess.api.services;

import chess.api.domain.ticTacToe.Game;
import chess.api.domain.ticTacToe.Player;
import chess.api.services.declarations.TicTacToeService;
import chess.api.utils.Constants;
import chess.api.utils.URIGenerator;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

public class TicTacToeServiceImpl implements TicTacToeService {

    private final Map<String, Game> games = new ConcurrentHashMap<>();

    @Override
    public void hostGame(String sessionId) {
        Game game = new Game();
        game.setXPlayer(new Player(sessionId, null));
        this.games.put(URIGenerator.getAvailableURI(games), game);
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
            game.getMap()[move] = Objects.equals(game.getOPlayer().getSessionId(), sessionId)
                    ? Constants.X_PLAYER
                    : Constants.O_PLAYER;
        }

        return game;
    }

    @Override
    public Map<String, ? extends Game> getGames() {
        return this.games;
    }

}
