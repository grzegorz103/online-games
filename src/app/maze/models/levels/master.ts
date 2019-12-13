import { Level } from './level';
import { Computer } from '../computer';
import { MazeComponent } from '../../maze/maze.component';
import { Point } from '../point';
import { Path } from '../path';

export class Master extends Level {
    move(computer: Computer): void {
        let neighbours = MazeComponent.neighboursFields(computer);
        let move: Point;

        if (neighbours.some(e => e.row === MazeComponent.metaNode.current.row && e.col === MazeComponent.metaNode.current.col)) {
            computer.row = MazeComponent.metaNode.current.row;
            computer.col = MazeComponent.metaNode.current.col;
            return;
        } else {
            for (let prev = MazeComponent.metaNode.previous; prev !== null; prev = prev.previous) {
                if (neighbours.some(e => e.row === prev.current.row && e.col === prev.current.col)) {
                    move = prev.current;
                }
            }
        }
        computer.col = move.col;
        computer.row = move.row;

        let next: Path;
        for (let prev = MazeComponent.metaNode.previous; prev !== null; prev = prev.previous) {
            if (prev.previous === null) {
                next.previous = null;
            }

            next = prev;
        }
    }

}