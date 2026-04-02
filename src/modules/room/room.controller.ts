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
import { CheckDto, CreateRoomDto, DeleteRoomDto, DirectRoomDto, EditRoomDto, SearchRoomDto } from './dto/room.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {
  }
  
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  getAllRooms(@Req() request: any) {
    return this.roomService.getAllRooms(request.user.id);
  }
  
  @Get('/search')
  @UseGuards(JwtAuthGuard)
  getSearchedRooms(@Req() request: Request, @Query() searchDto: SearchRoomDto) {
    return this.roomService.getSearchedRooms(request, searchDto.q);
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
  
  @Post('/direct')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  getOrCreateDirectRoom(@Req() request: Request, @Body() directRoomDto: DirectRoomDto) {
    return this.roomService.getOrCreateDirectRoom((request as any).user.id, directRoomDto.targetUserId);
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
    return this.roomService.editRoom(request, editRoomDto.id, editRoomDto.name, editRoomDto.ownerId,
      editRoomDto.avatar
    );
  }
  
  @Delete('/delete')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  deleteRoom(@Req() request: Request, @Body() deleteRoomDto: DeleteRoomDto) {
    return this.roomService.deleteRoom(request, deleteRoomDto.id, deleteRoomDto.ownerId);
  }
}
