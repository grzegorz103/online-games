package chess.api.services;

import chess.api.domain.chess.Chess;
import chess.api.domain.chess.Player;
import chess.api.services.declarations.ChessService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChessServiceImpl implements ChessService {

    private Map<String, Chess> games = new ConcurrentHashMap<>();

    @Override
    public Chess addGame(String gameUri, boolean whiteStarts, String sessionId) {
        if (StringUtils.isNotBlank(gameUri)) {
            Chess chess = new Chess(
                    whiteStarts ? new Player(sessionId, null) : null,
                    whiteStarts ? null : new Player(sessionId, null),
                    new ArrayList<>(),
                    whiteStarts
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
                game.setBlackPlayer(new Player(sessionId, null));
            } else {
                game.setWhitePlayer(new Player(sessionId, null));
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

}
