import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../messages/message.service';
import { CreateMessageDto, DeleteMessageDto, EditMessageDto, KickUserDto } from '../messages/dto/message.dto';
import { RoomService } from '../room/room.service';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: process.env.FRONTEND_URL!,
    credentials: true,
    methods: ['GET', 'POST'],
  }
})
export class GatewayService {
  constructor(private messageService: MessageService, private roomService: RoomService) {
  }
  
  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() body: CreateMessageDto) {
    const message: any = await this.messageService.saveMessage(body.roomId, body.userId, body.content, body.username,
      body.type, body.fullPath
    );
    if (message) {
      this.server.to(body.roomName).emit('getMessage', {
        userId: body.userId,
        _id: message._id,
        username: body.username,
        message: body.content,
        fullPath: message.fullPath,
        createdAt: message.createdAt,
        type: message.type
      });
    }
  }
  
  @SubscribeMessage('editMessage')
  async editMessage(@MessageBody() body: EditMessageDto) {
    const message: any = await this.messageService.updateMessage(body.currentMessageId, body.messageUserId,
      body.content,
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
    await this.roomService.removeUser(body.roomId, body.userId);
    this.server.to(body.roomName).emit('getKickedUser', {
      userId: body.userId,
    });
  }
  
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() body: KickUserDto,
    @ConnectedSocket() socket: Socket
  ) {
    socket.join(body.roomName);
    
    await this.roomService.joinRoom(body.userId, body.roomId);
    
    this.server.to(body.roomName).emit('getJoinedUser', {
      userId: body.userId,
    });
  }
  
}

