import {Computer} from "./computer";

export abstract class Level{
    name: string;

    abstract move(computer: Computer): void;
}
