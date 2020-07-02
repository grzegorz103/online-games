package chess.api.domain.chess;

import chess.api.domain.shared.BaseMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class Message extends BaseMessage {

    private String authorSessionId;

    private Instant date;

    public Message(String message, String authorSessionId, Instant date) {
        super(message);
        this.authorSessionId = authorSessionId;
        this.date = date;
    }

}
