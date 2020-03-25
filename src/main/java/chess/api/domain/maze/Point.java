package chess.api.domain.maze;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Point {

    private int row;
    private int col;
    private boolean occupied;

}
