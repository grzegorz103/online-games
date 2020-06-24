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

    public Player(String sessionId, String username) {
        super(sessionId, username);
    }

}
