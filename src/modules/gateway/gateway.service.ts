import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../messages/message.service';
import { CreateMessageDto, DeleteMessageDto, EditMessageDto, KickUserDto } from '../messages/dto/message.dto';
import { RoomService } from '../room/room.service';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../../entities/message.schema';
import { Model } from 'mongoose';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: process.env.FRONTEND_URL!,
    credentials: true,
    methods: ['GET', 'POST'],
  }
})
export class GatewayService {
  constructor(private messageService: MessageService, private roomService: RoomService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {
  }
  
  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() body: CreateMessageDto) {
    const message: any = await this.messageService.saveMessage(body.roomId, body.userId, body.content, body.username,
      body.type, body.fullPath, body.fileName, body.fileSize,
    );
    if (message) {
      this.server.to(body.roomName).emit('getMessage', {
        userId: body.userId,
        _id: message._id,
        username: body.username,
        roomId: Number(message.roomId),
        message: body.content,
        fullPath: message.fullPath,
        fileName: message.fileName,
        fileSize: message.fileSize,
        createdAt: message.createdAt,
        type: message.type
      });
      this.server.emit('getLastMessage', {
        username: body.username,
        roomId: Number(message.roomId),
        message: body.content,
        fileName: message.fileName,
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
    const lastMessage = await this.messageModel.find({roomId: body.roomId}).sort({createdAt: -1}).limit(1);
    if (message) {
      this.server.to(body.roomName).emit('getDeletedId', {
        id: message._id,
      });
      this.server.emit('getLastMessage', {
        username: lastMessage[0].username,
        roomId: Number(lastMessage[0].roomId),
        message: lastMessage[0].message,
        fileName: lastMessage[0].fileName,
        type: lastMessage[0].type
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

