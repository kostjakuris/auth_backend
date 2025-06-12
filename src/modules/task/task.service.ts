import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status, Task } from '../../entities/task.entity';
import { Todo } from '../../entities/todo.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Todo) private todoRepository: Repository<Todo>) {
  }
  
  async getAllTasks(id: string) {
    const correctId = Number(id);
    const todo = await this.todoRepository.findOne({where: {id: correctId}});
    if (todo) {
      const tasks = await this.taskRepository.find({where: {todo}});
      return await this.createRecursiveTasks(tasks);
    }
    throw new NotFoundException('Todo Not Found');
  }
  
  async createTask(id: number, name: string, description: string, position: number, parentId?: number) {
    const todo = await this.todoRepository.findOne({where: {id}});
    if (todo) {
      return await this.taskRepository.save({name, description, todo, parentId, position});
    }
    throw new NotFoundException('This todo wasn`t found');
  }
  
  async editTask(id: number, name: string, description: string, position: number, status?: Status) {
    return await this.taskRepository.update({id}, {name, description, position, status});
  }
  
  async editTaskPosition(list: Task[]) {
    const changedList: Task[] = await this.changeTasksPosition(list);
    changedList.map(async(item: Task) => {
      return await this.taskRepository.update({id: item.id},
        {
          name: item.name,
          description: item.description,
          position: item.position,
          status: item.status
        }
      );
    });
  }
  
  async deleteTask(id: number) {
    const subtasks = await this.taskRepository.find({where: {parentId: id}});
    if (subtasks) {
      for (const task of subtasks) {
        await this.taskRepository.delete(task.id);
      }
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
          parent.subTasks.sort((a: {position: number;}, b: {position: number;}) =>
            a.position - b.position);
        }
      }
    });
    
    return tasks.filter((task) => task.parentId === null).sort(
      (a, b) => a.position - b.position).map(
      (task) => correctTasks[task.id]);
  }
  
  private async changeTasksPosition(tasks: Task[]) {
    const correctTasks = {};
    
    tasks.forEach((task) => {
      correctTasks[task.id] = {...task, subTasks: [], position: tasks.indexOf(task) + 1};
    });
    
    return tasks.map((task) => correctTasks[task.id]);
  }
}

