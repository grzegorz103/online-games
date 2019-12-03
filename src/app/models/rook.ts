import { Piece } from './piece';
import { Color } from './color';
import { Point } from './point';
import { BoardComponent } from '../board/board.component';

export class Rook extends Piece {

    constructor(point: Point, color: Color, image: string) {
        super(point, color, image);
    }

    getPossibleMoves(): Point[] {
        let possiblePoints = [];

        let row = this.point.row;
        let col = this.point.col;

        for(let i = row + 1; i < 8; ++i){ // dol
            if(!BoardComponent.isFieldTakenByEnemy(i, col, Color.BLACK) || BoardComponent.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            }else{
                break;
            }
        }

       for(let i = row - 1; i >= 0; --i){ // gora
            if(!BoardComponent.isFieldTakenByEnemy(i, col, Color.BLACK) || BoardComponent.isFieldEmpty(i, col)){
                possiblePoints.push(new Point(i, col));
            }else{
                break;
            }
        }
            
        for(let j = col - 1; j >= 0; --j){ // lewo
            if(!BoardComponent.isFieldTakenByEnemy(row, j, Color.BLACK) || BoardComponent.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            }else{
                break;
            }
        }
        
        for(let j = col + 1; j < 8; ++j){ // prawo
            if(!BoardComponent.isFieldTakenByEnemy(row, j, Color.BLACK) || BoardComponent.isFieldEmpty(row, j)){
                possiblePoints.push(new Point(row, j));
            }else{
                break;
            }
        } 

        return possiblePoints;
    }
}