import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status, Task } from './task.entity';
import { Todo } from '../todo/todo.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Todo) private todoRepository: Repository<Todo>) {
  }
  
  async getAllTasks(name: string) {
    const todo = await this.todoRepository.findOne({where: {name}});
    if (todo) {
      const tasks = await this.taskRepository.find({where: {todo}});
      return await this.createRecursiveTasks(tasks);
    }
    throw new NotFoundException('Todo Not Found');
  }
  
  async createTask(todoName: string, name: string, description: string, parentId?: number) {
    const todo = await this.todoRepository.findOne({where: {name: todoName}});
    if (todo) {
      return await this.taskRepository.save({name, description, todo, parentId});
    }
    throw new NotFoundException('This todo wasn`t found');
  }
  
  async editTask(id: number, name: string, description: string, status?: Status) {
    return await this.taskRepository.update({id}, {name, description, status});
  }
  
  async deleteTask(id: number) {
    const subtask = await this.taskRepository.findOne({where: {parentId: id}});
    if (subtask) {
      await this.taskRepository.delete(subtask.id);
    }
    return await this.taskRepository.delete(id);
  }
  
  private async createRecursiveTasks(tasks: Task[]) {
    const correctTasks = {};
    
    tasks.forEach((task) => {
      correctTasks[task.id] = {...task, subTasks: []};
    });
    
    tasks.forEach((task) => {
      if (task.parentId !== null) {
        const parent = correctTasks[task.parentId];
        if (parent) {
          parent.subTasks.push(correctTasks[task.id]);
        }
      }
    });
    
    return tasks.filter((task) => task.parentId === null).
      map((task) => correctTasks[task.id]);
  }
}

