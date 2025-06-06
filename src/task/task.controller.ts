import { Body, Controller, Delete, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, DeleteTaskDto, EditTaskDto, GetTasksDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {
  }
  
  @Post('/all')
  @UseGuards(JwtAuthGuard)
  getAllTasks(@Body() taskDto: GetTasksDto) {
    return this.taskService.getAllTasks(taskDto.name);
  }
  
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createTask(@Body() taskDto: CreateTaskDto) {
    if (taskDto.parentId) {
      return this.taskService.createTask(taskDto.todoName, taskDto.name, taskDto.description,
        taskDto.parentId
      );
    } else {
      return this.taskService.createTask(taskDto.todoName, taskDto.name, taskDto.description);
    }
  }
  
  @Patch('/edit')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  editTask(@Body() taskDto: EditTaskDto) {
    if (!taskDto.status) {
      return this.taskService.editTask(taskDto.id, taskDto.name, taskDto.description);
    } else {
      return this.taskService.editTask(taskDto.id, taskDto.name, taskDto.description, taskDto.status);
    }
  }
  
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteTask(@Body() taskDto: DeleteTaskDto) {
    return this.taskService.deleteTask(taskDto.id);
  }
}
