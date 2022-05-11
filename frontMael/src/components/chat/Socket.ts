import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

export class WebSocket {
  socket: Socket;

  constructor(url: string) {
    const socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: Cookies.get('access_token'),
          },
        },
      },
    };
    // this.socket = io(url, socketOptions);
    this.socket = io(url, socketOptions);
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    // this.socket.close();
    this.socket.disconnect();
  }
}
