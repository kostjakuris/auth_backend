import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString({message: 'Todo name must be a string'})
  @IsNotEmpty({message: 'Todo name is required'})
  readonly name: string;
}

export class EditTodoDto {
  @IsNumber({}, {message: 'Id must be a number'})
  @IsNotEmpty({message: 'Todo id is required'})
  readonly id: number;
  
  @IsString({message: 'Todo name must be a string'})
  @IsNotEmpty({message: 'Todo name is required'})
  readonly name: string;
}

export class DeleteTodoDto {
  @IsNumber({}, {message: 'Id must be a number'})
  @IsNotEmpty({message: 'Todo id is required'})
  readonly id: number;
}
