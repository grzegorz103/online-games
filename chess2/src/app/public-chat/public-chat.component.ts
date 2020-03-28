import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import * as Stomp from 'stompjs';
import {Message} from "./models/message";

@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss']
})
export class PublicChatComponent implements OnInit {

  ws: any;
  username = prompt('Wprowdz swoj nick');
  message = new Message();
  messages: Message[] = [];

  constructor() {
  }

  ngOnInit() {
    let socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(socket);
    this.joinChat();
  }

  private joinChat() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });

      that.ws.subscribe("/topic/public/chat", message => {
        that.messages.push(JSON.parse(message.body));
      });

      that.ws.send("/app/public/chat/" + that.username + "/join", {}, {})

    }, function (error) {
      alert("STOMP error " + error);
    });
  }

  sendMessage() {
    if (this.message && this.message.message.length === 0)
      return;

    this.ws.send("/app/public/chat/send", {}, JSON.stringify(this.message));
  }

}
