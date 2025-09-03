import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../../entities/message.schema';
import { Model } from 'mongoose';
import { RoomService } from '../room/room.service';

@Injectable()
export class MessageService {
  constructor(private roomService: RoomService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {
  }
  
  async getAllMessages(id: string) {
    const messages = await this.messageModel.find({roomId: Number(id)});
    if (messages.length > 0) {
      return messages;
    }
    return [];
  }
  
  async updateMessage(id: string, messageUserId: string, message: string, userId: number, ownerId: number) {
    if (userId === Number(messageUserId) || userId === ownerId) {
      return this.messageModel.findByIdAndUpdate({_id: id}, {message, isUpdated: true}, {new: true});
    }
    throw new ForbiddenException(`You don't have any permissions to update this message`);
  }
  
  async deleteMessage(id: string, messageUserId: string, ownerId: number, userId: number) {
    if (userId === Number(messageUserId) || userId === ownerId) {
      return this.messageModel.findByIdAndDelete({_id: id}, {new: true});
    }
    throw new ForbiddenException(`You don't have any permissions to delete this message`);
  }
  
  async saveMessage(id: number, userId: number, content: string, username: string, type: string,
    fullPath: string | null = null) {
    const room = await this.roomService.findCurrentRoom(String(id));
    if (room) {
      const newMessage = new this.messageModel({roomId: id, message: content, username, userId, type, fullPath});
      return await newMessage.save();
    }
    throw new NotFoundException('This room was not found');
  }
}
