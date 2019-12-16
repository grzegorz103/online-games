import { Level } from './level';
import { Computer } from '../computer';

export class Engine {

    level: Level;

    setLevel(level: Level) {
        this.level = level;
    }

    move(computer: Computer) {
        this.level.move(computer);
    }

}
