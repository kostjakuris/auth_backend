import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CheckDto, CreateRoomDto, DeleteRoomDto, EditRoomDto } from './dto/room.dto';
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
  
  @Get('/check')
  @UseGuards(JwtAuthGuard)
  checkUserExistence(@Req() request: Request, @Query() checkDto: CheckDto) {
    return this.roomService.checkUserExistence(request, Number(checkDto.id));
  }
  
  @Get('/current-room')
  @UseGuards(JwtAuthGuard)
  getCurrentRoom(@Query() checkDto: CheckDto) {
    return this.roomService.findCurrentRoom(checkDto.id);
  }
  
  @Post('/create')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  createRoom(@Req() request: Request, @Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(request, createRoomDto);
  }
  
  @Patch('/edit')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  editRoom(@Req() request: Request, @Body() editRoomDto: EditRoomDto) {
    return this.roomService.editRoom(request, editRoomDto.id, editRoomDto.name, editRoomDto.ownerId);
  }
  
  @Delete('/delete')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  deleteRoom(@Req() request: Request, @Body() deleteRoomDto: DeleteRoomDto) {
    return this.roomService.deleteRoom(request, deleteRoomDto.id, deleteRoomDto.ownerId);
  }
}
