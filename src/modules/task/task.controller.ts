import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateTaskDto, DeleteTaskDto, EditTaskDto, EditTaskPositionDto, GetTasksDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {
  }
  
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  getAllTasks(@Query() taskDto: GetTasksDto) {
    return this.taskService.getAllTasks(taskDto.id);
  }
  
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createTask(@Body() taskDto: CreateTaskDto) {
    return this.taskService.createTask(taskDto.id, taskDto.name, taskDto.description,
      taskDto.position, taskDto.parentId
    );
  }
  
  @Patch('/edit')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  editTask(@Body() taskDto: EditTaskDto) {
    return this.taskService.editTask(taskDto.id, taskDto.name, taskDto.description,taskDto.position, taskDto.status);
  }
  
  @Patch('/edit-position')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  editTaskPosition(@Body() taskDto: EditTaskPositionDto) {
    return this.taskService.editTaskPosition(taskDto.list);
  }
  
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteTask(@Body() taskDto: DeleteTaskDto) {
    return this.taskService.deleteTask(taskDto.id);
  }
}
