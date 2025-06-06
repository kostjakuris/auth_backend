import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { Task } from '../task/task.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private usersService: UsersService) {
  }
  
  async getAllTodos(request: any) {
    const user = await this.usersService.findUserByEmail(request.user.email);
    if (user) {
      const todos = await this.todoRepository.find({where: {user: user}});
      if (todos) {
        return todos;
      }
      throw new BadRequestException('No todos found');
    }
  }
  
  async createTodo(request: any, name: string) {
    const user = await this.usersService.findUserByEmail(request.user.email);
    if (user) {
      const todo = await this.todoRepository.findOne({where: {user: user, name}});
      if (todo) {
        throw new ConflictException('This todo already exists');
      }
    }
    return await this.todoRepository.save({name, user: request.user});
  }
  
  async editTodo(id: number, name: string) {
    return await this.todoRepository.update({id}, {name});
  }
  
  async deleteTodo(id: number) {
    const todo = await this.todoRepository.findOne({where: {id}});
    if (todo) {
      await this.taskRepository.delete({todo: todo});
      await this.todoRepository.delete(id);
    }
  }
}
