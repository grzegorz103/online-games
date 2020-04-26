package chess.api.services.declarations;

import chess.api.domain.ticTacToe.Game;

import java.util.Map;

public interface TicTacToeService {

    Game hostGame(String sessionId, String uri);

    Game joinGame(String uri, String sessionId);

    Game move(String uri, String sessionId, int move);

    Map<String, ? extends Game> getGames();
}
