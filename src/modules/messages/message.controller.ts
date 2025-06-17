import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { MessageService } from './message.service';
import { GetMessagesDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {
  
  }
  
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  getAllMessages(@Query() getMessagesDto: GetMessagesDto) {
    return this.messageService.getAllMessages(getMessagesDto.id);
  }
  
}
