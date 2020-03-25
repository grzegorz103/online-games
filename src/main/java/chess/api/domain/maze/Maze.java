package chess.api.domain.maze;

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

    private Set<Player> players = new HashSet<>();

    public Maze(Point[][] points) {
        this.points = points;
    }

    public void addPlayer(Player player) {
        if (player != null) {
            players.add(player);
        }
    }
}
