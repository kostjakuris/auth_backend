import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly name: string;
}

export class JoinRoomDto {
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly name: string;
}

