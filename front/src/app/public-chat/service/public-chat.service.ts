import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {Message} from "../models/message";
import {Member} from "../models/member";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../security/auth.service";
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class PublicChatService {

  ws: any;
  username;
  messages: Message[] = [];
  randomId: string;
  members: Member[] = [];
  socket: WebSocket;
  loading: boolean = true;
  message = new Message();

  //scroll: ElementRef;


  constructor(private auth: AuthService) {
    this.socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(this.socket);

    if (this.auth.loggedIn) {
      this.auth.userProfile$.subscribe(res => this.username = res.nickname);
    } else {
      do {
        this.username = prompt('Wprowadz swój nick');
      } while (!this.username);
    }
  }

  connect() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });

      that.ws.subscribe("/user/queue/public/chat/id", message => {
        that.randomId = JSON.parse(message.body);
        that.loading = false;
      });

      that.ws.subscribe("/topic/public/chat", message => {
        that.processMessage(JSON.parse(message.body));
      });

      that.ws.subscribe("/queue/public/chat/users", message => {
        that.members = JSON.parse(message.body);
      });

      that.ws.send("/app/public/chat/" + that.username + "/join", {}, {})
    }, function (error) {
      that.socket.close();
    });
  }

  sendMessage() {
    if (this.message && this.message.message.length == 0)
      return;

    this.ws.send("/app/public/chat/send", {}, JSON.stringify(this.message));
    this.message.clearMessage();
  }

  processMessage(message: Message) {
    if (message.type === 'MESSAGE') {
      message.message = (message.authorRandomId === this.randomId
        ? 'Ty: '
        : message.authorUsername + ': ') + message.message;
    }
    this.messages.push(message);
  }

}
