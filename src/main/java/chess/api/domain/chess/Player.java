package chess.api.domain.chess;

import chess.api.domain.shared.BaseUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class Player extends BaseUser {

    private boolean rematchSent;

    public Player(String sessionId, String username, boolean rematchSent) {
        super(sessionId, username);
        this.rematchSent = rematchSent;
    }

}
