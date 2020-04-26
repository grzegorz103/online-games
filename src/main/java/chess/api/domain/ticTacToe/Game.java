package chess.api.domain.ticTacToe;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class Game {

    private Player xPlayer;

    private Player OPlayer;

    private String[] map = new String[9];

    private State state;

    private Player currentPlayer;

    private Player winner;
}
