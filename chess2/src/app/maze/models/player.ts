import { Point } from './point';

export class Player extends Point{
   
    constructor(row: number, col: number, name: string){
        super(row, col, name);
    }

}