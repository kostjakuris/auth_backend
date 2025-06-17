import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {
  }
  
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  getAllRooms() {
    return this.roomService.getAllRooms();
  }
  
  @Post('/create')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  createRoom(@Req() request: Request, @Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(request, createRoomDto);
  }
  
  @Post('/join')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  joinRoom(@Req() request: Request, @Body() joinRoomDto: JoinRoomDto) {
    return this.roomService.joinRoom(request, joinRoomDto);
  }
}
