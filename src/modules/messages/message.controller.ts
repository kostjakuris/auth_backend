import { Body, Controller, Delete, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { MessageService } from './message.service';
import { DeleteMessageDto, GetMessagesDto, UpdateMessageDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {
  
  }
  
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  getAllMessages(@Query() getMessagesDto: GetMessagesDto) {
    return this.messageService.getAllMessages(getMessagesDto.id);
  }
  
  @Patch('/edit-message')
  @UseGuards(JwtAuthGuard)
  updateMessage(@Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.updateMessage(updateMessageDto.id, updateMessageDto.message);
  }
  
  @Delete('/delete-message')
  @UseGuards(JwtAuthGuard)
  deleteMessage(@Body() deleteMessageDto: DeleteMessageDto) {
    return this.messageService.deleteMessage(deleteMessageDto.id);
  }
}
