import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { IUser } from './interface/user.interface';
import { IChannel } from './interface/channel.interface';

type handleFunction = (...args: any[]) => void;

export class SocketHandler {
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
    this.socket = io(url, socketOptions);
  }

  connect() {
    this.socket.on('connect', () => {});
  }

  disconnect() {
    this.socket.on('disconnect', () => {});
  }

  addChannel(name: string, creator: IUser) {
    const channel: IChannel = {
      name,
      owner: creator,
    };
    this.socket.emit('createChannel', channel);
  }

  handleEvent(type: string, fct: handleFunction) {
    this.socket.on(type, fct);
  }

  emitEvent(type: string, data: any) {
    this.socket.emit(type, { data });
  }
}
