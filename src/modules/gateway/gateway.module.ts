import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MessageModule } from '../messages/message.module';
import { RoomModule } from '../room/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../entities/message.schema';

@Module({
  providers: [GatewayService],
  imports: [MessageModule, RoomModule, MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]),]
})
export class GatewayModule {
}


