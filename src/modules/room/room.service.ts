import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
import { CreateRoomDto } from './dto/room.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomService {
  constructor(private usersService: UsersService, @InjectRepository(Room) private roomRepository: Repository<Room>) {
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
  
  async findCurrentRoom(id: number) {
    return await this.roomRepository.findOne({where: {id}});
  }
  
  async createRoom(request: any, createRoomDto: CreateRoomDto) {
    const user = await this.usersService.findUserById(request.user.id);
    if (user) {
      return await this.roomRepository.save({...createRoomDto, users: [user]});
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
}
