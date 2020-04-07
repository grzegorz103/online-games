package chess.api.services.declarations;

import chess.api.domain.maze.Player;

public interface PlayerService {

    Player getBySessionId(String sessionId);

}
