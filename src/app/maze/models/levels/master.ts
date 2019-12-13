import { Level } from './level';
import { Computer } from '../computer';
import { MazeComponent } from '../../maze/maze.component';
import { Point } from '../point';

export class Master extends Level {
    move(computer: Computer): void {
        let neighbours = MazeComponent.neighboursFields(computer);
        let move: Point;

        // if(neighbours.some(e=>e.row ===MazeComponent.metaNode.current.row && e.col ===MazeComponent.metaNode.current.col ){
        //     maze = 
        //  }
        for (let prev = MazeComponent.metaNode.previous; prev !== null; prev = prev.previous) {
            if (neighbours.some(e => e.row === prev.current.row && e.col === prev.current.col)) {
                move = prev.current;
            }
        }

        computer.col === move.col;
        computer.row === move.row;

        let current = MazeComponent.metaNode.current;
        for (let prev = MazeComponent.metaNode.previous; prev !== null; prev = prev.previous) {
            if (prev.current.col === move.row && prev.current.col === move.col) {
                prev.
            }
        }
    }

}