import { Level } from './level';
import { Computer } from '../computer';
import { MazeComponent } from '../../maze/maze.component';
import { Point } from '../point';

export class Easy extends Level {

    move(computer: Computer): void {
        if (computer) {
            const neighbours = MazeComponent.neighbours(new Point(computer.row, computer.col, null));
            const move = neighbours[Math.floor(Math.random() * neighbours.length)];
            MazeComponent.moveComputer(computer, move);
        }
    }

}
