import { Computer } from '../computer';
import {Level} from "../level";

export class Engine {

    level: Level;

    setLevel(level: Level) {
        this.level = level;
    }

    move(computer: Computer) {
        this.level.move(computer);
    }

}
