import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }
  
  async createUser(userData: CreateUserDto) {
    return await this.userRepository.save(userData);
  }
  
  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({where: {email}});
  }
}
