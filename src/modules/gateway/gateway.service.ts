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
    this.server.on('connection', (socket: Socket) => {
      socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName);
      });
    });
  }
  
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: CreateMessageDto) {
    await this.messageService.saveMessage(body.roomId, body.content, body.username);
    this.server.to(body.roomName).emit('getMessage', {
      keyName: Math.random(),
      username: body.username,
      message: body.content
    });
  }
}