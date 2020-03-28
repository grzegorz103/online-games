package chess.api.domain.maze;

import chess.api.domain.shared.BaseUser;
import com.oracle.webservices.internal.api.message.BasePropertySet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class Player extends BaseUser {

    private Point point;

    public Player(String sessionId, String username, Point point) {
        super(sessionId, username);
        this.point = point;
    }
}
