import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { RoomModule } from './room/room.module';
import { MessageModule } from './messages/message.module';
import databaseConfig from '../config/database.config';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    UsersModule,
    AuthModule,
    GatewayModule,
    RoomModule,
    MessageModule
  ]
})
export class AppModule {
}
