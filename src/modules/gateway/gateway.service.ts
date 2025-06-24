import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MessageService } from '../messages/message.service';
import { CreateMessageDto, DeleteMessageDto, EditMessageDto, KickUserDto } from '../messages/dto/message.dto';
import { RoomService } from '../room/room.service';

@WebSocketGateway({
  cors: {
    origin: true
  }
})
export class GatewayService implements OnModuleInit {
  constructor(private messageService: MessageService, private roomService: RoomService) {
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
        createdAt: message.createdAt
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
        updatedAt: message.updatedAt
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
  
  @SubscribeMessage('kickUserFromRoom')
  async kickUser(@MessageBody() body: KickUserDto) {
    const user: any = await this.roomService.removeUser(body.roomId, body.userId);
    if (user) {
      this.server.to(body.roomName).emit('getKickedUser', {
        userId: body.userId,
      });
    }
  }
}

