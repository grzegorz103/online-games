package chess.api.services;

import chess.api.domain.ticTacToe.Game;
import chess.api.domain.ticTacToe.Player;
import chess.api.domain.ticTacToe.State;
import chess.api.services.declarations.TicTacToeService;
import chess.api.utils.Constants;
import org.apache.commons.lang3.StringUtils;
import org.springframework.scheduling.annotation.Scheduled;
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
        game.setState(State.NEW);
        game.setCurrentPlayer(game.getXPlayer());
        this.games.put(uri, game);
        return game;
    }

    @Override
    public Game joinGame(String uri, String sessionId) {
        Game game = this.games.get(uri);
        if (game != null) {
            game.setOPlayer(new Player(sessionId, null));
            game.setState(State.RUNNING);
        }
        return game;
    }

    @Override
    public Game move(String uri, String sessionId, int move) {
        Game game = this.games.get(uri);
        if (game != null) {
            if (game.getState() == State.RUNNING && Objects.equals(game.getCurrentPlayer().getSessionId(), sessionId)
                    && StringUtils.isEmpty(game.getMap()[move])) {
                game.getMap()[move] = Objects.equals(game.getOPlayer().getSessionId(), sessionId)
                        ? Constants.X_PLAYER
                        : Constants.O_PLAYER;
                game.setCurrentPlayer(
                        Objects.equals(game.getCurrentPlayer().getSessionId(), game.getXPlayer().getSessionId())
                                ? game.getOPlayer()
                                : game.getXPlayer()
                );

                checkWin(game);
            }
        }
        return game;
    }

    private void checkWin(Game game) {
        if (game != null) {
            String[] map = game.getMap();
            if ((Objects.equals(map[0], Constants.X_PLAYER) &&
                    Objects.equals(map[1], Constants.X_PLAYER) &&
                    Objects.equals(map[2], Constants.X_PLAYER)) ||
                    (Objects.equals(map[3], Constants.X_PLAYER) &&
                            Objects.equals(map[4], Constants.X_PLAYER) &&
                            Objects.equals(map[5], Constants.X_PLAYER)) ||
                    (Objects.equals(map[6], Constants.X_PLAYER) &&
                            Objects.equals(map[7], Constants.X_PLAYER) &&
                            Objects.equals(map[8], Constants.X_PLAYER))) {
                game.setState(State.CLOSED);
                game.setWinner(game.getXPlayer());
            }

            if ((Objects.equals(map[0], Constants.O_PLAYER) &&
                    Objects.equals(map[1], Constants.O_PLAYER) &&
                    Objects.equals(map[2], Constants.O_PLAYER)) ||
                    (Objects.equals(map[3], Constants.O_PLAYER) &&
                            Objects.equals(map[4], Constants.O_PLAYER) &&
                            Objects.equals(map[5], Constants.O_PLAYER)) ||
                    (Objects.equals(map[6], Constants.O_PLAYER) &&
                            Objects.equals(map[7], Constants.O_PLAYER) &&
                            Objects.equals(map[8], Constants.O_PLAYER))) {
                game.setState(State.CLOSED);
                game.setWinner(game.getOPlayer());
            }

            if ((Objects.equals(map[0], Constants.X_PLAYER) &&
                    Objects.equals(map[3], Constants.X_PLAYER) &&
                    Objects.equals(map[6], Constants.X_PLAYER)) ||
                    (Objects.equals(map[1], Constants.X_PLAYER) &&
                            Objects.equals(map[4], Constants.X_PLAYER) &&
                            Objects.equals(map[7], Constants.X_PLAYER)) ||
                    (Objects.equals(map[2], Constants.X_PLAYER) &&
                            Objects.equals(map[5], Constants.X_PLAYER) &&
                            Objects.equals(map[8], Constants.X_PLAYER))) {
                game.setState(State.CLOSED);
                game.setWinner(game.getXPlayer());
            }

            if ((Objects.equals(map[0], Constants.O_PLAYER) &&
                    Objects.equals(map[3], Constants.O_PLAYER) &&
                    Objects.equals(map[6], Constants.O_PLAYER)) ||
                    (Objects.equals(map[1], Constants.O_PLAYER) &&
                            Objects.equals(map[4], Constants.O_PLAYER) &&
                            Objects.equals(map[7], Constants.O_PLAYER)) ||
                    (Objects.equals(map[2], Constants.O_PLAYER) &&
                            Objects.equals(map[5], Constants.O_PLAYER) &&
                            Objects.equals(map[8], Constants.O_PLAYER))) {
                game.setState(State.CLOSED);
                game.setWinner(game.getXPlayer());
            }

            if ((Objects.equals(map[0], Constants.X_PLAYER) &&
                    Objects.equals(map[4], Constants.X_PLAYER) &&
                    Objects.equals(map[8], Constants.X_PLAYER)) ||
                    (Objects.equals(map[2], Constants.X_PLAYER) &&
                            Objects.equals(map[4], Constants.X_PLAYER) &&
                            Objects.equals(map[6], Constants.X_PLAYER))) {
                game.setState(State.CLOSED);
                game.setWinner(game.getXPlayer());
            }

            if ((Objects.equals(map[0], Constants.O_PLAYER) &&
                    Objects.equals(map[4], Constants.O_PLAYER) &&
                    Objects.equals(map[8], Constants.O_PLAYER)) ||
                    (Objects.equals(map[2], Constants.O_PLAYER) &&
                            Objects.equals(map[4], Constants.O_PLAYER) &&
                            Objects.equals(map[6], Constants.O_PLAYER))) {
                game.setState(State.CLOSED);
                game.setWinner(game.getXPlayer());
            }
        }
    }

    @Override
    public Map<String, ? extends Game> getGames() {
        return this.games;
    }

    @Scheduled(fixedRate = Constants.REMOVE_INACTIVE_TIC_TAC_TOE_GAMES)
    public void removeInactiveGames() {
        this.games
                .values()
                .removeIf(e -> e.getState() == State.CLOSED);
    }

}