package chess.api.services;

import chess.api.domain.chess.Chess;
import chess.api.domain.chess.Player;
import chess.api.domain.chess.State;
import chess.api.domain.ticTacToe.Game;
import chess.api.services.declarations.ChessService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChessServiceImpl implements ChessService {

    private Map<String, Chess> games = new ConcurrentHashMap<>();

    @Override
    public Chess addGame(String gameUri, boolean whiteStarts, String sessionId, Integer time) {
        if (StringUtils.isNotBlank(gameUri)) {
            Chess chess = new Chess(
                    whiteStarts ? new Player(sessionId, null, false) : null,
                    whiteStarts ? null : new Player(sessionId, null, false),
                    new ArrayList<>(),
                    whiteStarts,
                    State.RUNNING,
                    time
            );
            games.put(gameUri, chess);
            return chess;
        }

        throw new IllegalArgumentException("Invalid URI provided");
    }

    @Override
    public Chess joinGame(String gameUri, String sessionId) {
        Chess game = games.get(gameUri);
        if (game != null) {
            if (game.isWhiteStarts()) {
                game.setBlackPlayer(new Player(sessionId, null, false));
            } else {
                game.setWhitePlayer(new Player(sessionId, null, false));
            }
        }
        return game;
    }

    @Override
    public Chess makeMove(String gameUri, String sessionId, String move) {
        Chess game = games.get(gameUri);
        if (game != null) {
            game.getMoveHistory().add(move);
        }

        return game;
    }

    @Override
    public Map<String, Chess> getGames() {
        return this.games;
    }

    @Override
    public Chess rematch(String gameUri, String sessionId) {
        Chess game = games.get(gameUri);
        if (game != null) {
            //  if (game.getState() == State.CLOSED) {
            if (Objects.equals(game.getWhitePlayer().getSessionId(), sessionId)) {
                game.getWhitePlayer().setRematchSent(true);
            } else if (Objects.equals(game.getBlackPlayer().getSessionId(), sessionId)) {
                game.getBlackPlayer().setRematchSent(true);
                //       }
            }
        } else {
            throw new IllegalArgumentException();
        }

        return game;
    }

    public void resetGame(Chess game) {
        Player whitePlayer = game.getWhitePlayer();
        whitePlayer.setRematchSent(false);
        game.getBlackPlayer().setRematchSent(false);
        game.setWhitePlayer(game.getBlackPlayer());
        game.setBlackPlayer(whitePlayer);
        game.setMoveHistory(new ArrayList<>());
        game.setState(State.RUNNING);
    }

    @Override
    public Chess getGameBySessionId(String sessionId) {
        return games.values()
                .stream()
                .filter(e -> isPlayerInGame(sessionId, e))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Player not found in chess games"));
    }

    @Override
    public void delete(Chess chess) {
        this.games.values()
                .remove(chess);
    }

    private boolean isPlayerInGame(String sessionId, Chess chess) {
        return (chess.getWhitePlayer() != null && Objects.equals(chess.getWhitePlayer().getSessionId(), sessionId))
                || (chess.getBlackPlayer() != null && Objects.equals(chess.getBlackPlayer().getSessionId(), sessionId));
    }

}
