import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from '../users/mail.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../../entities/todo.entity';

@Module({
  providers: [AuthService, MailService],
  controllers: [AuthController],
  imports: [UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    }),
    TypeOrmModule.forFeature([Todo])
  ],
  exports: [
    JwtModule,
    AuthService
  ],
})
export class AuthModule {
}
