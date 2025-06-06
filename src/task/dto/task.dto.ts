import { Status } from '../task.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetTasksDto {
  @IsString({message: 'Todo name must be a string'})
  @IsNotEmpty({message: 'Todo name is required'})
  readonly name: string;
}

export class CreateTaskDto {
  @IsString({message: 'Task name must be a string'})
  @IsNotEmpty({message: 'Task name is required'})
  readonly name: string;
  
  @IsString({message: 'Todo name must be a string'})
  @IsNotEmpty({message: 'Todo name is required'})
  readonly todoName: string;
  
  @IsString({message: 'Description must be a string'})
  @IsNotEmpty({message: 'Description is required'})
  readonly description: string;
  readonly parentId?: number;
}

export class EditTaskDto {
  @IsNumber({}, {message: 'Task id must be a number'})
  readonly id: number;
  
  @IsString({message: 'Task name must be a string'})
  readonly name: string;
  
  @IsString({message: 'Description must be a string'})
  readonly description: string;
  readonly status: Status;
}

export class DeleteTaskDto {
  @IsNumber({}, {message: 'Id must be a number'})
  readonly id: number;
}
