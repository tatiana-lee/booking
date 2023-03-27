import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SupportService } from './support.service';
import { Types } from 'mongoose';
import { from, map, Observable } from 'rxjs';
import { Message } from './schemas/message.schema';

@WebSocketGateway({ cors: true })
export class SupportGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly supportService: SupportService) {}

  @WebSocketServer() ws: Server;

  private logger: Logger = new Logger('SupportGateway');

  afterInit(server: Server) {
    this.logger.log(`Initialized ${server}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('get-all-messages')
  async getAllMessages(
    @MessageBody('id') id: string | Types.ObjectId,
  ): Promise<Observable<WsResponse<Message>>> {
    const data = await this.supportService.getMessages(id);
    return from(data).pipe(map((data) => ({ event: 'all-messages', data })));
  }

  @SubscribeMessage('subscribe-to-chat')
  subscribeToChat(
    @MessageBody('id') id: string | Types.ObjectId,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(id.toString());
  }
}
