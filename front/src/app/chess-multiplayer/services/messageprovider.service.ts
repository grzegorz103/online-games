import {Injectable} from '@angular/core';
import {Message} from "../models/message";

@Injectable({
  providedIn: 'root'
})
export class MessageproviderService {

  messages: Message[];

  constructor() {
    this.messages = [];
  }

  addMessage(message: Message) {
    if (message) {
      this.messages.push(message);
    }
  }

}
