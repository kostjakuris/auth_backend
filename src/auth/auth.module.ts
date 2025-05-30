import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';

@Module({
  providers: [AuthService, MailService],
  controllers: [AuthController],
  imports: [UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    }),
  ],
  exports: [
    JwtModule,
    AuthService
  ],
})
export class AuthModule {
}
