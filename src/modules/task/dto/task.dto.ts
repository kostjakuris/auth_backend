import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../../../entities/task.entity';

export class GetTasksDto {
  @IsString({message: 'Todo id must be a string'})
  @IsNotEmpty({message: 'Todo id is required'})
  readonly id: string;
}

export class CreateTaskDto {
  @IsString({message: 'Task name must be a string'})
  @IsNotEmpty({message: 'Task name is required'})
  readonly name: string;
  
  @IsNumber({}, {message: 'Todo id must be a number'})
  @IsNotEmpty({message: 'Todo id is required'})
  readonly id: number;
  
  @IsString({message: 'Description must be a string'})
  @IsNotEmpty({message: 'Description is required'})
  readonly description: string;
  
  readonly parentId?: number;
  
  @IsNumber({}, {message: 'Position be a number'})
  @IsNotEmpty({message: 'Position is required'})
  readonly position: number;
}

export class EditTaskDto {
  @IsNumber({}, {message: 'Task id must be a number'})
  readonly id: number;
  
  @IsString({message: 'Task name must be a string'})
  readonly name: string;
  
  @IsString({message: 'Description must be a string'})
  readonly description: string;
  
  @IsNumber({}, {message: 'Position be a number'})
  @IsNotEmpty({message: 'Position is required'})
  readonly position: number;
  readonly status: Status;
}

export class EditTaskPositionDto {
  @IsArray({message: 'List must be array'})
  @IsNotEmpty({message: 'List is required'})
  list: any[];
}

export class DeleteTaskDto {
  @IsNumber({}, {message: 'Id must be a number'})
  readonly id: number;
}
