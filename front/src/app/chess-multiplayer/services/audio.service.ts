import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audio = new Audio();

  constructor() {
  }

  play(src: string) {
    this.audio.src = src;
    this.audio.play();
  }

}
