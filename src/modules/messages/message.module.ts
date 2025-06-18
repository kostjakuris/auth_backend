import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../entities/message.schema';
import { RoomModule } from '../room/room.module';
import { MessageController } from './message.controller';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../../entities/room.entity';


@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    }),
    MongooseModule.forRoot('mongodb://kostja:root@localhost:27017/chat?authSource=admin'),
    MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]),
    TypeOrmModule.forFeature([Room]),
    RoomModule
  ],
  exports: [MessageService]
})
export class MessageModule {
}
