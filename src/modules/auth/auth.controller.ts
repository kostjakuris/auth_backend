import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginUserDto, RegenerateTokenDto, ResetPasswordDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  
  }
  
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Req() request: Request) {
    return this.authService.getUserInfo(request);
  }
  
  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() response: Response) {
    return this.authService.logout(response);
  }
  
  @Post('/regenerate-token')
  @UsePipes(ValidationPipe)
  regenerateToken(@Res({passthrough: true}) response: Response, @Body() requestData: RegenerateTokenDto) {
    return this.authService.regenerateToken(requestData, response);
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
  
  @Post('/register')
  @UsePipes(ValidationPipe)
  register(@Res({passthrough: true}) response: Response, @Body() userData: CreateUserDto) {
    return this.authService.register(userData, response);
  }
}
