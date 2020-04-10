package chess.api.domain.publicChat;

import chess.api.domain.shared.BaseMessage;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class Message extends BaseMessage {

    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate creationDate;

    private String authorSessionId;

    private String authorUsername;

    public Message(String message, LocalDate creationDate, String authorSessionId, String authorUsername) {
        super(message);
        this.creationDate = creationDate;
        this.authorSessionId = authorSessionId;
        this.authorUsername = authorUsername;
    }

}
