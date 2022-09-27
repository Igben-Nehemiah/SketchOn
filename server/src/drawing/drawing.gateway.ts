import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MESSAGE_TO_CLIENT, MESSAGE_TO_SERVER } from './constants';

@WebSocketGateway({ path: '/drawing' })
export class DrawingGateway {
  @SubscribeMessage(MESSAGE_TO_SERVER)
  handleMessage(client: Socket, payload: any) {
    client.broadcast.emit(MESSAGE_TO_CLIENT, payload);
  }
}
