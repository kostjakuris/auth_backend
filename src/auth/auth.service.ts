import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, RegenerateTokenDto } from '../users/dto/create.user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.entity';
import * as process from 'node:process';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {
  
  }
  
  async getUserInfo(request: any) {
    const user = await this.usersService.findUserByEmail(request.user.email);
    if (user) {
      return {username: user.username, email: user.email};
    }
  }
  
  async regenerateToken(requestData: RegenerateTokenDto, response: Response) {
    const decodedToken = this.jwtService.decode(requestData.refreshToken);
    const user = await this.usersService.findUserByEmail(decodedToken.email);
    if (user) {
      return this.generateToken(user, response);
    }
  }
  
  async login(userData: LoginUserDto, response: Response) {
    const user = await this.usersService.findUserByEmail(userData.email);
    if (user) {
      const isPasswordsEqual = await bcrypt.compare(userData.password, user.password);
      if (isPasswordsEqual) {
        return this.generateToken(user, response);
      }
    }
    throw new HttpException('You entered wrong data or password', HttpStatus.UNAUTHORIZED);
  }
  
  async register(userData: CreateUserDto, response: Response) {
    const existedUser = await this.usersService.findUserByEmail(userData.email);
    if (existedUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 5);
    const user = await this.usersService.createUser({...userData, password: hashedPassword});
    return this.generateToken(user, response);
  }
  
  private async generateToken(user: User, response: Response) {
    const payload = {username: user.username, email: user.email, id: user.id};
    const accessToken = this.jwtService.sign(payload, {expiresIn: '1h'});
    const refreshToken = this.jwtService.sign(payload,
      {secret: process.env.REFRESH_PRIVATE_KEY || 'refresh_secret'}
    );
    response.cookie('refresh_token', refreshToken, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
    response.cookie('access_token', accessToken, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      maxAge: Number(new Date(this.jwtService.decode(accessToken).exp * 1000)),
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    
  }
}
