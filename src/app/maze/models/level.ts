import { Computer } from './computer';

export abstract class Level{
    type: string;

    abstract moveBy(computer: Computer): void;
}