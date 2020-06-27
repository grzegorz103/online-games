package chess.api.services.declarations;

import chess.api.domain.chess.Chess;

import java.util.Map;

public interface ChessService {

    Chess addGame(String gameUri, boolean whiteStarts, String sessionId, Integer time);

    Chess joinGame(String gameUri, String sessionId);

    Chess makeMove(String gameUri, String sessionId, String move);

    Map<String, Chess> getGames();

    Chess rematch(String gameUri, String sessionId);

    void resetGame(Chess game);

    Chess getGameBySessionId(String sessionId);

    void delete(Chess chess);
}
