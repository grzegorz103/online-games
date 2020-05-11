package chess.api.domain.shared;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public abstract class BaseUser {

    protected String sessionId;

    protected String username;

    @JsonIgnore
    private final UUID randomId = UUID.randomUUID();

    public BaseUser(String sessionId, String username) {
        this.sessionId = sessionId;
        this.username = username;
    }

}
