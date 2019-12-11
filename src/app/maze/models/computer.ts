import { Point } from './point';

export class Computer extends Point {

    direction = 0;

    constructor(row: number, col: number, name: string){
        super(row, col, name);
    }
    
}