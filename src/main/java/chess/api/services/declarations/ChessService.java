package chess.api.services.declarations;

import chess.api.domain.chess.Chess;

import java.util.Map;

public interface ChessService {

    Chess addGame(String gameUri, boolean whiteStarts, String sessionId);

    Chess joinGame(String gameUri, String sessionId);

    Chess makeMove(String gameUri, String sessionId, String move);

    Map<String, Chess> getGames();

}