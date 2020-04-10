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
    this.publicChatService.sendMessage();
  }

  public scrollBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

}
