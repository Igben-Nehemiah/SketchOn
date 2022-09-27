import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MESSAGE_TO_CLIENT, MESSAGE_TO_SERVER } from './constants';

@WebSocketGateway({ path: '/chat' })
export class ChatGateway implements OnGatewayInit {
  private readonly logger: Logger = new Logger('ChatGateway');
  @WebSocketServer() private wss: Server;

  afterInit(server: Server) {
    this.logger.log('Initialised');
  }
  @SubscribeMessage(MESSAGE_TO_SERVER)
  handleMessage(client: Socket, payload: string) {
    client.broadcast.emit(MESSAGE_TO_CLIENT, payload);
    // return { event: MESSAGE_TO_CLIENT, data: 'Hello world' };
  }
}
