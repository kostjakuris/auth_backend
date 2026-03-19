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
export class GoogleAuthDto {
  @IsString({message: 'iss must be a string'})
  @IsNotEmpty({message: 'iss is required'})
  readonly iss: string;
  @IsString({message: 'code must be a string'})
  @IsNotEmpty({message: 'code is required'})
  readonly code: string;
  @IsString({message: 'scope must be a string'})
  @IsNotEmpty({message: 'scope is required'})
  readonly scope: string;
  @IsString({message: 'authuser must be a string'})
  @IsNotEmpty({message: 'authuser is required'})
  readonly authuser: string;
  @IsString({message: 'prompt must be a string'})
  @IsNotEmpty({message: 'prompt is required'})
  readonly prompt: string;
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