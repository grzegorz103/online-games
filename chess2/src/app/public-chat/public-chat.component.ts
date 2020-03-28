import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss']
})
export class PublicChatComponent implements OnInit {

  ws: any;
  username = prompt('Wprowdz swoj nick');

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
        console.log('asd');
      });

      that.ws.send("/app/public/chat/send",{},{})

    }, function (error) {
      alert("STOMP error " + error);
    });
  }
}
