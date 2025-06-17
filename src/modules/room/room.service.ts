import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
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
  
  async joinRoom(request: any, joinRoomDto: JoinRoomDto) {
    const user = await this.usersService.findUserById(request.user.id);
    if (!user) {
      throw new NotFoundException('This user was not found');
    }
    const room = await this.roomRepository.findOneBy({name: joinRoomDto.name});
    if (!room) throw new NotFoundException(`Room not found`);
    
    await this.roomRepository.createQueryBuilder().relation(Room, 'users').of(room.id).add(user.id);
    
  }
}
