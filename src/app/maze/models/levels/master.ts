import { Level } from './level';
import { Computer } from '../computer';

export class Master extends Level {
    move(computer: Computer): void {
        throw new Error("Method not implemented.");
    }

}