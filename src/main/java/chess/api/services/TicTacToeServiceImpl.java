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
    public Game hostGame(Player player, String uri) {
        Game game = new Game();
        game.setXPlayer(player);
        game.setState(State.NEW);
        game.setCurrentPlayer(game.getXPlayer());
        this.games.put(uri, game);
        return game;
    }

    @Override
    public Game joinGame(String uri, Player player) {
        Game game = this.games.get(uri);
        if (game != null) {
            game.setOPlayer(player);
            game.setState(State.RUNNING);
        } else {
            throw new IllegalArgumentException();
        }
        return game;
    }

    @Override
    public Game move(String uri, String sessionId, int move) {
        Game game = this.games.get(uri);
        if (game != null) {
            if (game.getState().isRunning()
                    && Objects.equals(game.getCurrentPlayer().getSessionId(), sessionId)
                    && StringUtils.isEmpty(game.getMap()[move])) {
                game.getMap()[move] = Objects.equals(game.getOPlayer().getSessionId(), sessionId)
                        ? Constants.O_PLAYER
                        : Constants.X_PLAYER;
                game.setCurrentPlayer(
                        Objects.equals(game.getCurrentPlayer().getSessionId(), game.getXPlayer().getSessionId())
                                ? game.getOPlayer()
                                : game.getXPlayer()
                );

                checkWin(game);
            }
        } else {
            throw new IllegalArgumentException();
        }

        return game;
    }

    private void checkWin(Game game) {
        if (game != null) {
            String[] map = game.getMap();
            if ((Objects.equals(map[0], Constants.X_PLAYER) && Objects.equals(map[1], Constants.X_PLAYER) && Objects.equals(map[2], Constants.X_PLAYER)) || (Objects.equals(map[3], Constants.X_PLAYER) && Objects.equals(map[4], Constants.X_PLAYER) && Objects.equals(map[5], Constants.X_PLAYER)) || (Objects.equals(map[6], Constants.X_PLAYER) && Objects.equals(map[7], Constants.X_PLAYER) && Objects.equals(map[8], Constants.X_PLAYER))) {
                game.setState(State.CLOSED);
                game.getXPlayer().setWinner(true);
            }

            if ((Objects.equals(map[0], Constants.O_PLAYER) && Objects.equals(map[1], Constants.O_PLAYER) && Objects.equals(map[2], Constants.O_PLAYER)) || (Objects.equals(map[3], Constants.O_PLAYER) && Objects.equals(map[4], Constants.O_PLAYER) && Objects.equals(map[5], Constants.O_PLAYER)) || (Objects.equals(map[6], Constants.O_PLAYER) && Objects.equals(map[7], Constants.O_PLAYER) && Objects.equals(map[8], Constants.O_PLAYER))) {
                game.setState(State.CLOSED);
                game.getOPlayer().setWinner(true);
            }

            if ((Objects.equals(map[0], Constants.X_PLAYER) && Objects.equals(map[3], Constants.X_PLAYER) && Objects.equals(map[6], Constants.X_PLAYER)) || (Objects.equals(map[1], Constants.X_PLAYER) && Objects.equals(map[4], Constants.X_PLAYER) && Objects.equals(map[7], Constants.X_PLAYER)) || (Objects.equals(map[2], Constants.X_PLAYER) && Objects.equals(map[5], Constants.X_PLAYER) && Objects.equals(map[8], Constants.X_PLAYER))) {
                game.setState(State.CLOSED);
                game.getXPlayer().setWinner(true);
            }

            if ((Objects.equals(map[0], Constants.O_PLAYER) && Objects.equals(map[3], Constants.O_PLAYER) && Objects.equals(map[6], Constants.O_PLAYER)) || (Objects.equals(map[1], Constants.O_PLAYER) && Objects.equals(map[4], Constants.O_PLAYER) && Objects.equals(map[7], Constants.O_PLAYER)) || (Objects.equals(map[2], Constants.O_PLAYER) && Objects.equals(map[5], Constants.O_PLAYER) && Objects.equals(map[8], Constants.O_PLAYER))) {
                game.setState(State.CLOSED);
                game.getOPlayer().setWinner(true);
            }

            if ((Objects.equals(map[0], Constants.X_PLAYER) && Objects.equals(map[4], Constants.X_PLAYER) && Objects.equals(map[8], Constants.X_PLAYER)) || (Objects.equals(map[2], Constants.X_PLAYER) && Objects.equals(map[4], Constants.X_PLAYER) && Objects.equals(map[6], Constants.X_PLAYER))) {
                game.setState(State.CLOSED);
                game.getXPlayer().setWinner(true);
            }

            if ((Objects.equals(map[0], Constants.O_PLAYER) && Objects.equals(map[4], Constants.O_PLAYER) && Objects.equals(map[8], Constants.O_PLAYER)) || (Objects.equals(map[2], Constants.O_PLAYER) && Objects.equals(map[4], Constants.O_PLAYER) && Objects.equals(map[6], Constants.O_PLAYER))) {
                game.setState(State.CLOSED);
                game.getOPlayer().setWinner(true);
            }

            if (game.getState().isRunning() &&
                    Arrays.stream(map)
                            .filter(Objects::nonNull)
                            .count() == Constants.TIC_TAC_TOE_MAP_SIZE) {
                game.setState(State.CLOSED);
                game.setDraw(true);
            }
        }
    }

    @Override
    public Map<String, ? extends Game> getGames() {
        return this.games;
    }

    @Override
    public Game rematch(String uri, String sessionId) {
        Game game = this.games.get(uri);
        if (game != null) {
            if (game.getState() == State.CLOSED) {
                if (Objects.equals(game.getXPlayer().getSessionId(), sessionId)) {
                    game.getXPlayer().setRematchRequestSend(true);
                } else if (Objects.equals(game.getOPlayer().getSessionId(), sessionId)) {
                    game.getOPlayer().setRematchRequestSend(true);
                }

                if (game.getOPlayer().isRematchRequestSend() && game.getXPlayer().isRematchRequestSend()) {
                    resetGame(game);
                }
            }
        } else {
            throw new IllegalArgumentException();
        }

        return game;
    }

    @Override
    public Game getByPlayerSessionId(String sessionId) {
        return this.games
                .values()
                .stream()
                .filter(e -> isPlayerInGame(sessionId, e))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Player not found"));
    }

    private boolean isPlayerInGame(String sessionId, Game game) {
        return (game.getXPlayer() != null && Objects.equals(game.getXPlayer().getSessionId(), sessionId))
                || (game.getOPlayer() != null && Objects.equals(game.getOPlayer().getSessionId(), sessionId));
    }

    @Override
    public void abandonGame(String sessionId) {
        Game game = getByPlayerSessionId(sessionId);
        game.setState(State.ABANDONED);
    }

    private void resetGame(Game game) {
        game.setDraw(false);
        game.setState(State.RUNNING);
        game.getOPlayer().setWinner(false);
        game.getXPlayer().setWinner(false);
        game.setMap(new String[9]);
        Player xTemp = game.getXPlayer();
        game.setXPlayer(game.getOPlayer());
        game.setOPlayer(xTemp);
        game.getXPlayer().setRematchRequestSend(false);
        game.getOPlayer().setRematchRequestSend(false);
        game.setCurrentPlayer(game.getXPlayer());
    }

    @Scheduled(fixedRate = Constants.REMOVE_INACTIVE_TIC_TAC_TOE_GAMES)
    public void removeInactiveGames() {
        this.games
                .values()
                .removeIf(e -> e.getState() == State.CLOSED && e.getXPlayer() == null && e.getOPlayer() == null);
    }

}
