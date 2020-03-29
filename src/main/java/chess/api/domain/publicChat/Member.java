package chess.api.domain.publicChat;

import chess.api.domain.shared.BaseUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class Member extends BaseUser {

    public Member(String sessionId, String username) {
        super(sessionId, username);
    }

}
