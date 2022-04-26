import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleError(client, exception);
  }

  public handleError(client: Socket, exception: HttpException | WsException) {
    if (exception instanceof HttpException) {
      // handle http exception
      client.emit('Error', new BadRequestException('password format invalid'));
    } else {
      // handle websocket exception
      // exception already emit before
    }
  }
}
