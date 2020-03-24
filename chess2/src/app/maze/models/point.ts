export class Point{
    row: number;
    col: number;
    occupied = false;
    name: string;

    constructor(row: number, col: number, name: string){
        this.row = row;
        this.col = col;
        this.name = name;
    }
}
