import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber({}, {message: 'Room id must be a number'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly roomId: number;
  
  @IsString({message: 'Content must be a string'})
  @IsNotEmpty({message: 'Content is required'})
  readonly content: string;
  
  @IsString({message: 'User name must be a string'})
  @IsNotEmpty({message: 'User name is required'})
  readonly username: string;
  
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly roomName: string;
}

export class GetMessagesDto {
  @IsString({message: 'Todo id must be a string'})
  @IsNotEmpty({message: 'Todo id is required'})
  readonly id: string;
}