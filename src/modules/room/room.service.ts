import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
import { CreateRoomDto } from './dto/room.dto';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../../entities/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoomService {
  constructor(private usersService: UsersService, @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {
  }
  
  async getAllRooms() {
    const rooms = await this.roomRepository.find();
    if (rooms) {
      return rooms;
    }
    throw new NotFoundException('No rooms found');
  }
  
  async checkUserExistence(request: any, id: number) {
    const userInTheRoom = await this.roomRepository.createQueryBuilder('room').innerJoin('room.users', 'user').where(
      'room.id = :roomId', {roomId: id}).andWhere('user.id = :userId', {userId: request.user.id}).getOne();
    return !!userInTheRoom;
  }
  
  async findCurrentRoom(id: string) {
    const currentRoom = await this.roomRepository.findOne({where: {id: Number(id)}});
    if (currentRoom) {
      const allRoomUsers = currentRoom.users.map((user) => {
        return {id: user.id, username: user.username};
      });
      return {...currentRoom, users: allRoomUsers};
    }
    throw new NotFoundException(`This room wasn't found`);
  }
  
  async createRoom(request: any, createRoomDto: CreateRoomDto) {
    const user = await this.usersService.findUserById(request.user.id);
    if (user) {
      await this.roomRepository.save({...createRoomDto, users: [user]});
      return 'Room created successfully!';
    }
    throw new NotFoundException('This user was not found');
  }
  
  async joinRoom(request: any, id: number) {
    const user = await this.usersService.findUserById(request.user.id);
    if (!user) {
      throw new NotFoundException('This user was not found');
    }
    
    const userInTheRoom = await this.roomRepository.createQueryBuilder('room').innerJoin('room.users', 'user').where(
      'room.id = :roomId', {roomId: id}).andWhere('user.id = :userId', {userId: request.user.id}).getOne();
    
    if (!userInTheRoom) {
      await this.roomRepository.createQueryBuilder().relation(Room, 'users').of(id).add(user.id);
      return 'Welcome in the room!';
    }
    return true;
  }
  
  async removeUser(roomId: number, userId: number) {
    return await this.roomRepository.createQueryBuilder().relation(Room, 'users').of(roomId).remove(userId);
  }
  
  async editRoom(request: any, id: number, name: string, ownerId: number) {
    if (request.user.id === ownerId) {
      return await this.roomRepository.update({id}, {name});
    }
    throw new ForbiddenException(`You don't have any permissions to edit this room`);
  }
  
  async deleteRoom(request: any, id: number, ownerId: number) {
    if (request.user.id === ownerId) {
      const messages = await this.messageModel.find({roomId: id});
      if (messages) {
        for (const message of messages) {
          await this.messageModel.findByIdAndDelete(message._id);
        }
      }
      return await this.roomRepository.delete(id);
    }
    throw new ForbiddenException(`You don't have any permissions to delete this room`);
  }
}
