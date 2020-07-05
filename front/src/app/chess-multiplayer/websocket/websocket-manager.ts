export class WebsocketManager {

  private webSocket: any;

  constructor(webSocket: any) {
    this.webSocket = webSocket;
  }

  public register(uri: string, callback: (string) => void): WebsocketManager {
    this.webSocket.subscribe(uri, callback);
    return this;
  }

}
