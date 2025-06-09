import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({message: 'Email must be a string'})
  @IsNotEmpty({message: 'Email is required'})
  @IsEmail({}, {message: 'Your email is incorrect'})
  readonly email: string;
  
  @IsString({message: 'Password must be a string'})
  @IsNotEmpty({message: 'Password is required'})
  readonly password: string;
}

export class ResetPasswordDto {
  @IsString({message: 'Password must be a string'})
  @IsNotEmpty({message: 'Password is required'})
  readonly password: string;
  @IsString({message: 'Token must be a string'})
  readonly token: string;
}

export class ForgotPasswordDto {
  @IsString({message: 'Email must be a string'})
  @IsNotEmpty({message: 'Email is required'})
  @IsEmail({}, {message: 'Your email is incorrect'})
  readonly email: string;
}

export class RegenerateTokenDto {
  @IsString({message: 'Token must be a string'})
  readonly refreshToken: string;
}