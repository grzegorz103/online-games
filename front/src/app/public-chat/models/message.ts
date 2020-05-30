export class Message {

  message: string = '';
  authorRandomId: string = '';
  creationDate: any;

  clearMessage(): void {
    this.message = '';
  }

}
