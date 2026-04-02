import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
import { CreateRoomDto } from './dto/room.dto';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../../entities/message.schema';
import { Model } from 'mongoose';

export interface AllRooms extends Room {
  lastMessage: Message;
}

@Injectable()
export class RoomService {
  constructor(private usersService: UsersService, @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {
  }
  
  async getAllRooms(id: number) {
    const joinedRooms = await this.roomRepository.createQueryBuilder('room').innerJoin('room.users', 'filterUser',
      'filterUser.id = :userId', {userId: id}
    ).leftJoin('room.users', 'user').addSelect(['user.id', 'user.username']).getManyAndCount();
    const allRooms: AllRooms[] = [];
    for (const room of joinedRooms[0]) {
      const lastMessage = await this.messageModel.find({roomId: room.id}).sort({createdAt: -1}).limit(1);
      const chatLastMessage: any = lastMessage[0] ?? null;
      allRooms.push(
        {
          ...room,
          users: room.type === 'direct' ? [...room.users] as any : undefined,
          lastMessage: chatLastMessage ? {...chatLastMessage._doc} : null,
        });
    }
    return allRooms;
  }
  
  async getSearchedRooms(request: any, name: string) {
    const currentUserId = request.user.id;
    const [rooms, users] = await Promise.all([
      this.roomRepository.createQueryBuilder('room').where('room.name ILIKE :name', {name: `%${name}%`}).leftJoin(
        'room.users', 'user').addSelect(['user.id', 'user.username']).getMany(),
      this.usersService.searchUsersByUsername(name),
    ]);
    
    const completeRooms: AllRooms[] = [];
    
    const filteredRooms = rooms.filter(
      room => room.type !== 'direct' || room.users.some(u => u.id === currentUserId),
    );
    
    for (const room of filteredRooms) {
      const lastMessage = await this.messageModel.find({roomId: room.id}).sort({createdAt: -1}).limit(1);
      const chatLastMessage: any = lastMessage[0] ?? null;
      completeRooms.push(
        {
          ...room,
          lastMessage: chatLastMessage ? {...chatLastMessage._doc} : null,
        });
    }
    
    const completeRoomIds = new Set(completeRooms.map(r => r.id));
    
    const userResults = await Promise.all(
      users.map(async user => {
        const existingRoom = await this.roomRepository.createQueryBuilder('room').innerJoin('room.users', 'u1',
          'u1.id = :uid1', {uid1: currentUserId}
        ).innerJoin('room.users', 'u2', 'u2.id = :uid2', {uid2: user.id}).where('room.type = :type', {type: 'direct'}).
          leftJoin('room.users', 'user').addSelect(['user.id', 'user.username']).getOne();
        if (existingRoom) {
          if (completeRoomIds.has(existingRoom.id)) {
            return null;
          }
          const lastMessage = await this.messageModel.find({roomId: existingRoom.id}).sort({createdAt: -1}).limit(1);
          const chatLastMessage: any = lastMessage[0] ?? null;
          return {...existingRoom, lastMessage: chatLastMessage ? {...chatLastMessage._doc} : null};
        }
        return user;
      }),
    );
    
    return [...completeRooms, ...userResults.filter(item => item !== null)];
  }
  
  async getOrCreateDirectRoom(requesterId: number, targetUserId: number) {
    const existing = await this.roomRepository.createQueryBuilder('room').innerJoin('room.users', 'u1', 'u1.id = :uid1',
      {uid1: requesterId}
    ).innerJoin('room.users', 'u2', 'u2.id = :uid2', {uid2: targetUserId}).where('room.type = :type', {type: 'direct'}).
      getOne();
    
    if (existing) {
      return existing;
    }
    
    const [requester, target] = await Promise.all([
      this.usersService.findUserById(requesterId),
      this.usersService.findUserById(targetUserId),
    ]);
    
    if (!requester) throw new NotFoundException('Requester not found');
    if (!target) throw new NotFoundException('Target user not found');
    
    const name = `direct_${Math.min(requesterId, targetUserId)}_${Math.max(requesterId, targetUserId)}`;
    const newRoom = await this.roomRepository.save({
      name,
      ownerId: requesterId,
      type: 'direct',
      users: [requester, target],
    });
    return {
      id: newRoom.id,
      name: newRoom.name,
      ownerId: newRoom.ownerId,
      type: newRoom.type,
      users: newRoom.users.map(user => ({id: user.id, username: user.username})),
    };
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
      return {message: 'Room created successfully!'};
    }
    throw new NotFoundException('This user was not found');
  }
  
  async joinRoom(id: number, roomId: number) {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('This user was not found');
    }
    
    const userInTheRoom = await this.roomRepository.createQueryBuilder('room').innerJoin('room.users', 'user').where(
      'room.id = :roomId', {roomId: roomId}).andWhere('user.id = :userId', {userId: id}).getOne();
    
    if (!userInTheRoom) {
      await this.roomRepository.createQueryBuilder().relation(Room, 'users').of(roomId).add(user.id);
      return 'Welcome in the room!';
    }
    return true;
  }
  
  async removeUser(roomId: number, userId: number) {
    return await this.roomRepository.createQueryBuilder().relation(Room, 'users').of(roomId).remove(userId);
  }
  
  async editRoom(request: any, id: number, name: string, ownerId: number, avatar: string) {
    if (request.user.id === ownerId) {
      return await this.roomRepository.update({id}, {name, avatar});
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
