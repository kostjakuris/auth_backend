import { Injectable, NotFoundException } from '@nestjs/common';
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
  
  async updateMessage(id: string, message: string) {
    return this.messageModel.findByIdAndUpdate({_id: id}, {message});
  }
  
  async deleteMessage(id: string) {
    return this.messageModel.findByIdAndDelete({_id: id});
  }
  
  async saveMessage(id: number, userId: number, content: string, username: string) {
    const room = await this.roomService.findCurrentRoom(id);
    if (room) {
      const newMessage = new this.messageModel({roomId: id, message: content, username, userId});
      return await newMessage.save();
    }
    throw new NotFoundException('This room was not found');
  }
}
