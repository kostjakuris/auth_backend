import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly name: string;
  
  @IsNumber({}, {message: 'Owner id must be a number'})
  @IsNotEmpty({message: 'Owner id is required'})
  readonly ownerId: number;
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

export class EditRoomDto {
  @IsString({message: 'Room name must be a string'})
  @IsNotEmpty({message: 'Room name is required'})
  readonly name: string;
  
  @IsNumber({}, {message: 'Room id must be a number'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly id: number;
  
  @IsNumber({}, {message: 'Owner id must be a number'})
  @IsNotEmpty({message: 'Owner id is required'})
  readonly ownerId: number;
}

export class DeleteRoomDto {
  @IsNumber({}, {message: 'Room id must be a number'})
  @IsNotEmpty({message: 'Room id is required'})
  readonly id: number;
  
  @IsNumber({}, {message: 'Owner id must be a number'})
  @IsNotEmpty({message: 'Owner id is required'})
  readonly ownerId: number;
}
