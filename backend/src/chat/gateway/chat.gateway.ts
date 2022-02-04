import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../../auth/services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { IChannel } from '../interface/channel.interface';
import { Channel } from '../entities/channel.entity';
import { IPage } from '../interface/page.interface';
import { ConnectedUserService } from '../services/connected-user.service';
import { ConnectedUser } from '../entities/connected-user.entity';
import { IConnectedUser } from '../interface/connected-user.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'https://hoppscotch.io'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
    private readonly connectedUserService: ConnectedUserService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.usersService.findUser(decodedToken.sub);
      if (!user) {
        return this.disconnect(socket);
      } else {
        // connect
        socket.data.user = user;
        const channels = await this.chatService.getChannelForUser(user.id, {
          page: 1,
          limit: 10,
        });
        // channels.meta.currentPage -= 1;

        //  Save connection to database
        await this.connectedUserService.create({ socketId: socket.id, user });

        console.log('connect', socket.id);
        // Only emit channels to specific connected client
        return this.server.to(socket.id).emit('channels', channels);
      }
    } catch (e) {
      console.log(e);
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    console.log('disconnect', socket.id);
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('message')
  async sendMessages(@MessageBody() message: string) {
    this.server.emit('message', message);
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: IChannel) {
    const createdChannel: IChannel = await this.chatService.createChannel(
      channel,
      socket.data.user,
    );
    for (const user of createdChannel.users) {
      const connections = await this.connectedUserService.findByUser(user);
      const channels = await this.chatService.getChannelForUser(user.id, {
        page: 1,
        limit: 10,
      });
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('channels', channels);
      }
    }
  }

  @SubscribeMessage('paginateChannels')
  async onPaginateChannel(socket: Socket, page: IPage) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // page.page += 1;
    const channels = await this.chatService.getChannelForUser(
      socket.data.user.id,
      page,
    );
    return this.server.to(socket.id).emit('channels', channels);
  }
}
