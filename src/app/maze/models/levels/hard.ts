import { Level } from './level';
import { Computer } from '../computer';
import { MazeComponent } from '../../maze/maze.component';
import { Point } from '../point';

export class Hard extends Level {

    move(computer: Computer): void {
        if (computer) {
            let neighbours = MazeComponent.neighbours(new Point(computer.row, computer.col, null));
            let move = 0;

            if (neighbours.some(e => e === computer.direction)) { // zmienic na if neighbours.length > 2 (gdy jest wiecej niz 2 mozliwe sciezzki)
                if (neighbours.length > 2) {
                    move = neighbours.filter(e => e !== MazeComponent.oppositeDirections[computer.direction])[Math.floor(Math.random() * (neighbours.length - 1))];
                } else {
                    move = computer.direction;
                }
            } else {
                if (neighbours.length > 1) {
                    move = neighbours.filter(e => e !== MazeComponent.oppositeDirections[computer.direction])[Math.floor(Math.random() * (neighbours.length - 1))];
                } else {
                    move = neighbours[Math.floor(Math.random() * neighbours.length)];
                }
            }
            MazeComponent.moveComputer(computer, move);
            computer.direction = move;
        }
    }

}