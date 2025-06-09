import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({message: 'Username must be a string'})
  @IsNotEmpty({message: 'Username is required'})
  readonly username: string;
  
  @IsString({message: 'Email must be a string'})
  @IsNotEmpty({message: 'Email is required'})
  @IsEmail({}, {message: 'Your email is incorrect'})
  readonly email: string;
  
  @IsString({message: 'Password must be a string'})
  @IsNotEmpty({message: 'Password is required'})
  readonly password: string;
}