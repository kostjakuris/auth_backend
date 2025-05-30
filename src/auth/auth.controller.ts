import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  RegenerateTokenDto,
  ResetPasswordDto
} from '../users/dto/create.user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  
  }
  
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Req() request: Request) {
    return this.authService.getUserInfo(request);
  }
  
  @Post('/regenerate-token')
  regenerateToken(@Res({passthrough: true}) response: Response, @Body() requestData: RegenerateTokenDto) {
    return this.authService.regenerateToken(requestData, response);
  }
  
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
  
  @Patch('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  
  @Post('/login')
  login(@Res({passthrough: true}) response: Response, @Body() userData: LoginUserDto) {
    return this.authService.login(userData, response);
  }
  
  @Post('/register')
  register(@Res({passthrough: true}) response: Response, @Body() userData: CreateUserDto) {
    return this.authService.register(userData, response);
  }
}
