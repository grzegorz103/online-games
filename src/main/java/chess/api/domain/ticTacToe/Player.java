package chess.api.domain.ticTacToe;

import chess.api.domain.shared.BaseUser;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class Player extends BaseUser {

    private boolean rematchRequestSend;

    public Player(String sessionId, String username, boolean rematchRequestSend) {
        super(sessionId, username);
        this.rematchRequestSend = rematchRequestSend;
    }

}
