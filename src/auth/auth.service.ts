import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  RegenerateTokenDto,
  ResetPasswordDto
} from '../users/dto/create.user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.entity';
import * as process from 'node:process';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService) {
    
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
  
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findUserByEmail(forgotPasswordDto.email);
    if (user) {
      const payload = {id: user.id};
      const resetPasswordToken = this.jwtService.sign(payload, {expiresIn: '10m'});
      await this.mailService.sendResetLink(forgotPasswordDto.email, resetPasswordToken);
      return 'Link to reset password was sent to your email';
    }
    throw new UnauthorizedException('User with this email was not found');
  }
  
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const decodedToken = this.jwtService.decode(resetPasswordDto.token);
    if (!decodedToken) {
      throw new UnauthorizedException('Your token is probably wrong or expired');
    }
    const user = await this.usersService.findUserById(decodedToken.id);
    if (user) {
      const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 5);
      await this.usersService.changePassword(user.id, hashedPassword);
      return 'Your password was changed successfully';
    }
    throw new UnauthorizedException('Your token is probably wrong or expired');
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
