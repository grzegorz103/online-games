package chess.api.domain.ticTacToe;

import chess.api.domain.shared.BaseUser;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class Player extends BaseUser {

    private boolean rematchRequestSend;

    private boolean winner;

    public Player(String sessionId, String username, boolean rematchRequestSend, boolean winner) {
        super(sessionId, username);
        this.rematchRequestSend = rematchRequestSend;
        this.winner = winner;
    }

}
