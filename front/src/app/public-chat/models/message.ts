export class Message {

  message: string = '';
  authorSessionId: string;

  clearMessage(): void {
    this.message = '';
  }

}
