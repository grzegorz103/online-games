import { Level } from './level';
import { Computer } from '../computer';
import { MazeComponent } from '../../maze/maze.component';
import { Point } from '../point';

export class Easy extends Level {
    move(computer: Computer): void {
        if (computer) {
            let neighbours = MazeComponent.neighbours(new Point(computer.row, computer.col, null));

            let move = neighbours[Math.floor(Math.random() * neighbours.length)];

            switch (move) {
                case MazeComponent.UP:
                    computer.row -= 1;
                    break;
                case MazeComponent.DOWN:
                    computer.row += 1;
                    break;
                case MazeComponent.LEFT:
                    computer.col -= 1;
                    break;
                case MazeComponent.RIGHT:
                    computer.col += 1;
                    break;
            }
        }
    }

}