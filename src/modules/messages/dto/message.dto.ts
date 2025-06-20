import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber({}, {message: 'Room id must be a number'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly roomId: number;
  
  @IsString({message: 'Message id must be a string'})
  readonly messageId: string;
  
  @IsNumber({}, {message: 'User id must be a number'})
  @IsNotEmpty({message: 'User id is required'})
  readonly userId: number;
  
  @IsString({message: 'Content must be a string'})
  @IsNotEmpty({message: 'Content is required'})
  readonly content: string;
  
  @IsString({message: 'User name must be a string'})
  @IsNotEmpty({message: 'User name is required'})
  readonly username: string;
  
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly roomName: string;
  
  @IsString({message: 'Updated at must be a string'})
  @IsNotEmpty({message: 'Updated at is required'})
  readonly updatedAt: string;
}

export class GetMessagesDto {
  @IsString({message: 'Message id must be a string'})
  @IsNotEmpty({message: 'Message id is required'})
  readonly id: string;
}

export class UpdateMessageDto {
  @IsString({message: 'Message id must be a string'})
  @IsNotEmpty({message: 'Message id is required'})
  readonly id: string;
  
  @IsString({message: 'Message must be a string'})
  @IsNotEmpty({message: 'Message is required'})
  readonly message: string;
}

export class DeleteMessageDto {
  @IsString({message: 'Message id must be a string'})
  @IsNotEmpty({message: 'Message id is required'})
  readonly id: string;
}