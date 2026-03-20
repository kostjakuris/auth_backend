import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ForgotPasswordDto, GoogleAuthDto, LoginUserDto, RegenerateTokenDto, ResetPasswordDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/users.entity';
import * as process from 'node:process';
import { Response } from 'express';
import { MailService } from '../users/mail.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService) {
    
  }
  
  async getUserInfo(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      return {userId: user.id, username: user.username, email: user.email};
    }
  }
  
  async logout(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return response.send({message: 'Log out succesfull'});
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
  
  async loginWithGoogle(googleAuthDto: GoogleAuthDto, response: Response) {
    if (!googleAuthDto.code) {
      throw new HttpException('Code wasn\'t provided', HttpStatus.BAD_REQUEST);
    }
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        code: googleAuthDto.code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokens = await tokenRes.json();
    
    const profileRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );
    
    const profile = await profileRes.json();
    let currentUser: User | null = await this.usersService.findUserByEmail(profile.email);
    if (currentUser) {
      await this.generateToken(currentUser, response);
      await this.getUserInfo(profile.email);
      return response.redirect(process.env.FRONTEND_URL!);
    } else {
      currentUser = await this.usersService.createUser({username: profile.name, email: profile.email, password: ''});
      await this.generateToken(currentUser, response);
      await this.getUserInfo(profile.email);
      return response.redirect(process.env.FRONTEND_URL!);
    }
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
      {secret: process.env.REFRESH_PRIVATE_KEY || 'refresh_secret', expiresIn: '3d'}
    );
    
    const cookieOptions = {
      secure: true,
      sameSite: 'none' as const,
      httpOnly: true,
      path: '/'
    };
    
    response.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: this.jwtService.decode(refreshToken).exp * 1000 - Date.now(),
    });
    response.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: this.jwtService.decode(accessToken).exp * 1000 - Date.now(),
    });
    return response.send(HttpStatus.OK);
  }
}
