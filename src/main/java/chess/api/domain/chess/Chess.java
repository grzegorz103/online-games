package chess.api.domain.chess;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chess {

    private Player whitePlayer;

    private Player blackPlayer;

    private List<String> moveHistory;

    private boolean whiteStarts;

    @JsonIgnore
    public String getLastMoveHistory() {
        return moveHistory.get(moveHistory.size() - 1);
    }

}
