import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber({}, {message: 'Room id must be a number'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly roomId: number;
  
  @IsNumber({}, {message: 'User id must be a number'})
  @IsNotEmpty({message: 'User id is required'})
  readonly userId: number;
  
  @IsString({message: 'Content must be a string'})
  @IsNotEmpty({message: 'Content is required'})
  readonly content: string;
  
  @IsString({message: 'Message type must be a string'})
  @IsNotEmpty({message: 'Message type is required'})
  readonly type: string;
  
  @IsString({message: 'User name must be a string'})
  @IsNotEmpty({message: 'User name is required'})
  readonly username: string;
  
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly roomName: string;
}

export class EditMessageDto {
  @IsString({message: 'Message id must be a string'})
  @IsNotEmpty({message: 'Message id is required'})
  readonly messageId: string;
  
  @IsString({message: 'Message user id must be a string'})
  @IsNotEmpty({message: 'Message user id is required'})
  readonly messageUserId: string;
  
  @IsNumber({}, {message: 'User id must be a number'})
  @IsNotEmpty({message: 'User id is required'})
  readonly userId: number;
  
  @IsNumber({}, {message: 'Owner id must be a number'})
  @IsNotEmpty({message: 'Owner id is required'})
  readonly ownerId: number;
  
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
  @IsString({message: 'Message id must be a string'})
  @IsNotEmpty({message: 'Message id is required'})
  readonly id: string;
}


export class DeleteMessageDto {
  @IsString({message: 'Message id must be a string'})
  @IsNotEmpty({message: 'Message id is required'})
  readonly messageId: string;
  
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly roomName: string;
  
  @IsNumber({}, {message: 'Owner id must be a number'})
  @IsNotEmpty({message: 'Owner id is required'})
  readonly ownerId: number;
  
  @IsNumber({}, {message: 'User id must be a number'})
  @IsNotEmpty({message: 'User id is required'})
  readonly userId: number;
  
  @IsString({message: 'Message user id must be a string'})
  @IsNotEmpty({message: 'Message user id is required'})
  readonly messageUserId: string;
}

export class KickUserDto {
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly roomName: string;
  
  @IsNumber({}, {message: 'Room id must be a number'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly roomId: number;
  
  @IsNumber({}, {message: 'User id must be a number'})
  @IsNotEmpty({message: 'User id is required'})
  readonly userId: number;
}