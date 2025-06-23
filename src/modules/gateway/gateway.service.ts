import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MessageService } from '../messages/message.service';
import { CreateMessageDto, DeleteMessageDto, EditMessageDto } from '../messages/dto/message.dto';

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
  
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() body: CreateMessageDto) {
    const message: any = await this.messageService.saveMessage(body.roomId, body.userId, body.content, body.username);
    if (message) {
      this.server.to(body.roomName).emit('getMessage', {
        userId: body.userId,
        _id: message._id,
        username: body.username,
        message: body.content,
        createdAt: new Date(message.createdAt).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        }).replace('at', ''),
      });
    }
  }
  
  @SubscribeMessage('editMessage')
  async editMessage(@MessageBody() body: EditMessageDto) {
    const message: any = await this.messageService.updateMessage(body.messageId, body.messageUserId, body.content,
      body.userId, body.ownerId
    );
    if (message) {
      this.server.to(body.roomName).emit('getUpdatedMessage', {
        userId: body.userId,
        _id: message._id,
        username: body.username,
        message: body.content,
        isUpdated: message.isUpdated,
        updatedAt: new Date(message.updatedAt).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        }).replace('at', ''),
      });
    }
  }
  
  @SubscribeMessage('deleteMessage')
  async deleteMessage(@MessageBody() body: DeleteMessageDto) {
    const message: any = await this.messageService.deleteMessage(body.messageId, body.messageUserId, body.ownerId,
      body.userId
    );
    if (message) {
      this.server.to(body.roomName).emit('getDeletedId', {
        id: message._id,
      });
    }
  }
}