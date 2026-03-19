import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../entities/message.schema';
import { RoomModule } from '../room/room.module';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../../entities/room.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';


@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('MONGODB_USER')}:${configService.get('MONGODB_PASSWORD')}@${configService.get('MONGODB_CLUSTER_STRING')}/?appName=${configService.get('MONGODB_CLUSTER_APP_NAME')}`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]),
    TypeOrmModule.forFeature([Room]),
    RoomModule
  ],
  exports: [MessageService]
})
export class MessageModule {
}
