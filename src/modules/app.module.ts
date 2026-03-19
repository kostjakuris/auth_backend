import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { RoomModule } from './room/room.module';
import { MessageModule } from './messages/message.module';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `postgresql://postgres.${process.env.POSTGRES_HOST}:${encodeURIComponent(
        String(process.env.POSTGRES_PASSWORD))}@aws-1-eu-west-1.pooler.supabase.com:${process.env.POSTGRES_PORT}/postgres`,
      ssl: {rejectUnauthorized: false},
      logging: false,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    GatewayModule,
    RoomModule,
    MessageModule
  ]
})
export class AppModule {
}
