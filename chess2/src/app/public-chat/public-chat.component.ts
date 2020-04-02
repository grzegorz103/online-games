import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import * as Stomp from 'stompjs';
import {Message} from "./models/message";
import {Member} from "./models/member";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss']
})
export class PublicChatComponent implements OnInit {

  ws: any;
  username;
  message = new Message();
  messages: Message[] = [];
  sessionId: string;
  loading: boolean = true;
  members: Member[] = [];

  constructor(private auth: AuthService) {

  }

  ngOnInit() {
    let socket = new WebSocket(environment.wsUrl);
    this.ws = Stomp.over(socket);

    if (this.auth.loggedIn) {
      this.auth.userProfile$.subscribe(res => this.username = res.nickname);
    } else {
      do {
        this.username = prompt('Wprowadz swój nick');
      } while (!this.username);
    }

    this.joinChat();
  }

  private joinChat() {
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });

      that.ws.subscribe("/user/queue/public/chat/id", message => {
        that.sessionId = message.body;
        that.loading = false;
      });

      that.ws.subscribe("/topic/public/chat", message => {
        that.messages.push(JSON.parse(message.body));
      });

      that.ws.subscribe("/queue/public/chat/users", message => {
        that.members = JSON.parse(message.body);
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
