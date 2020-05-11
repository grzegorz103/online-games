package chess.api.services.declarations;

import chess.api.domain.ticTacToe.Game;
import chess.api.domain.ticTacToe.Player;

import java.util.Map;

public interface TicTacToeService {

    Game hostGame(Player player, String uri);

    Game joinGame(String uri, Player player);

    Game move(String uri, String sessionId, int move);

    Map<String, ? extends Game> getGames();

    Game rematch(String uri, String sessionId);

    Game getByPlayerSessionId(String sessionId);

    void abandonGame(String sessionId);
}
