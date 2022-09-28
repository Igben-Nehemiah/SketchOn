import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MESSAGE_TO_CLIENT, MESSAGE_TO_SERVER } from './constants';

@WebSocketGateway({
  path: '/drawing',
  cors: { origin: 'http://127.0.0.1:5173' },
  maxHttpBufferSize: 4e6,
})
export class DrawingGateway {
  @SubscribeMessage(MESSAGE_TO_SERVER)
  handleMessage(client: Socket, payload: any) {
    client.broadcast.emit(MESSAGE_TO_CLIENT, payload);
  }
}
