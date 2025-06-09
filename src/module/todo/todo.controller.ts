import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateTodoDto, DeleteTodoDto, EditTodoDto } from './dto/todo.dto';
import { Request } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {
  }
  
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  getTodos(@Req() request: Request) {
    return this.todoService.getAllTodos(request);
  }
  
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createTodo(@Req() request: Request, @Body() todoDto: CreateTodoDto) {
    return this.todoService.createTodo(request, todoDto.name);
  }
  
  @Patch('/edit')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  editTodo(@Body() todoDto: EditTodoDto) {
    return this.todoService.editTodo(todoDto.id, todoDto.name);
  }
  
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteTodo(@Body() todoDto: DeleteTodoDto) {
    return this.todoService.deleteTodo(todoDto.id);
  }
}
