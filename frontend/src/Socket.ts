import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { IUser } from './interface/user.interface';
import { IChannel } from './interface/channel.interface';
import { Member } from './interface/member.interface';

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
    this.socket.on('connect', () => {
      console.log('connect', this.socket.id);
    });
  }

  disconnect() {
    this.socket.on('disconnect', () => {
      console.log('disconnect', this.socket.id);
    });
  }

  addChannel(name: string, creator: IUser) {
    const channel: IChannel = {
      name,
      users: [creator],
    };
    this.socket.emit('createChannel', channel);
  }

  receiveEvent(type: string, fct: handleFunction) {
    this.socket.on(type, fct);
  }

  sendEvent(type: string, data: any) {
    this.socket.emit(type, data);
  }
}
