import { Point } from './point';

export class Path {

    previous: Path;
    current: Point;

    constructor(previous: Path, current: Point ) {
        this.current = current;
        this.previous = previous;
    }

}