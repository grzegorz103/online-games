export class Message{

  message: string;
  date: string;
  authorSessionId: string;

  constructor(message: string, date: string, authorSessionId: string) {
    this.message = message;
    this.date = date;
    this.authorSessionId = authorSessionId;
  }

}
