import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly name: string;
}

export class JoinRoomDto {
  @IsNumber({}, {message: 'Room id must be a number'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly id: number;
}

export class CheckDto {
  @IsString({message: 'Room id must be a string'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly id: string;
}
