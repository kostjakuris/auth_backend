import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Room } from '../../entities/room.entity';
import { UsersModule } from '../users/users.module';


@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [UsersModule, JwtModule.register({
    secret: process.env.PRIVATE_KEY || 'secret',
  }), TypeOrmModule.forFeature([Room])],
  exports: [RoomService]
})
export class RoomModule {
}
