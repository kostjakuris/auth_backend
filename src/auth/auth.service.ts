import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.entity';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {
  
  }
  
  async login(userData: CreateUserDto) {
    const user = await this.usersService.findUserByEmail(userData.email);
    if (user) {
      const isPasswordsEqual = await bcrypt.compare(userData.password, user.password);
      if (isPasswordsEqual) {
        return this.generateToken(user);
      }
    }
    throw new HttpException('You entered wrong data or password', HttpStatus.UNAUTHORIZED);
  }
  
  async register(userData: CreateUserDto) {
    const existedUser = await this.usersService.findUserByEmail(userData.email);
    if (existedUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 5);
    const user = await this.usersService.createUser({...userData, password: hashedPassword});
    return this.generateToken(user);
  }
  
  private async generateToken(user: User) {
    const payload = {email: user.email, id: user.id};
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload,
        {secret: process.env.REFRESH_PRIVATE_KEY || 'refresh_secret', expiresIn: '24h'}
      )
    };
  }
}
