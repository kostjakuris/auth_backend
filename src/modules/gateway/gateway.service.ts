import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MessageService } from '../messages/message.service';
import { CreateMessageDto } from '../messages/dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: true
  }
})
export class GatewayService implements OnModuleInit {
  constructor(private messageService: MessageService) {
  }
  
  @WebSocketServer()
  server: Server;
  
  onModuleInit(): any {
    this.server.on('connect', (socket: Socket) => {
      socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName);
      });
    });
  }
  
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: CreateMessageDto) {
    const message = await this.messageService.saveMessage(body.roomId, body.userId, body.content, body.username);
    if (message) {
      this.server.to(body.roomName).emit('getMessage', {
        userId: body.userId,
        _id: message._id,
        username: body.username,
        message: body.content,
        updatedAt: body.updatedAt,
      });
    }
  }
}