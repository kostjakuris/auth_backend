import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, GoogleAuthDto, LoginUserDto, ResetPasswordDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  
  }
  
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Req() request: any) {
    return this.authService.getUserInfo(request.user.email);
  }
  
  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({passthrough: true}) response: Response) {
    return this.authService.logout(response);
  }
  
  @Post('/regenerate-token')
  @UsePipes(ValidationPipe)
  regenerateToken(@Res({passthrough: true}) response: Response, @Req() request: Request) {
    return this.authService.regenerateToken(request, response);
  }
  
  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
  
  @Patch('/reset-password')
  @UsePipes(ValidationPipe)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  
  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Res({passthrough: true}) response: Response, @Body() userData: LoginUserDto) {
    return this.authService.login(userData, response);
  }
  
  @Get('/google')
  loginWithGoogle(@Res() response: Response, @Query() googleAuthDto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(googleAuthDto, response);
  }
  
  @Post('/register')
  @UsePipes(ValidationPipe)
  register(@Res({passthrough: true}) response: Response, @Body() userData: CreateUserDto) {
    return this.authService.register(userData, response);
  }
}
