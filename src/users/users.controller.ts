import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }
  
  @Post()
  createUser(@Body() userData: CreateUserDto) {
    return this.usersService.createUser(userData);
  }
  
  @Post()
  findUserByEmail(@Body() userData: CreateUserDto) {
    return this.usersService.findUserByEmail(userData.email);
  }
}
