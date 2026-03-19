import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from '../users/mail.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  providers: [AuthService, MailService],
  controllers: [AuthController],
  imports: [UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('PRIVATE_KEY'),
      }),
    }),
  ],
  exports: [
    JwtModule,
    AuthService
  ],
})
export class AuthModule {
}
