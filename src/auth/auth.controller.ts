import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  
  }
  
  @Post('/login')
  login(@Body() userData: CreateUserDto) {
    return this.authService.login(userData);
  }
  
  @Post('/register')
  register(@Body() userData: CreateUserDto) {
    return this.authService.register(userData);
  }
}
