export class Message {

  message: string = '';
  authorRandomId: string = '';
  creationDate: any;
  authorUsername: string;
  type: string;

  clearMessage(): void {
    this.message = '';
  }

}
