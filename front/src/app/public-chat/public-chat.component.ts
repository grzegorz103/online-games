import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import * as Stomp from 'stompjs';
import {Message} from "./models/message";
import {Member} from "./models/member";
import {AuthService} from "../auth.service";
import {PublicChatService} from "./service/public-chat.service";

@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss']
})
export class PublicChatComponent implements OnInit {

  @ViewChild('scrollMe', {read: ElementRef, static: false}) private scroll: ElementRef;

  message = new Message();

  constructor(private auth: AuthService,
              private publicChatService: PublicChatService) {

  }

  ngOnInit() {
    this.joinChat();
  }

  private joinChat() {
    this.publicChatService.connect();
  }

  sendMessage() {
    if (this.message && this.message.message.length == 0)
      return;

  //  this.ws.send("/app/public/chat/send", {}, JSON.stringify(this.message));
    this.message.clearMessage();
  }

  public scrollBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

  ngOnDestroy(): void {
   // this.socket.close();
  }

}
