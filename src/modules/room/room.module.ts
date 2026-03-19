import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Room } from '../../entities/room.entity';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../entities/message.schema';


@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [UsersModule, TypeOrmModule.forFeature([Room]),
    MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}])],
  exports: [RoomService]
})
export class RoomModule {
}
