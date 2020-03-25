package chess.api.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maze {

    private Point[][] points;

    private Set<String> players = new HashSet<>();

    public Maze(Point[][] points) {
        this.points = points;
    }
}
