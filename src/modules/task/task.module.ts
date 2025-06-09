import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';
import { Todo } from '../../entities/todo.entity';
import * as process from 'node:process';


@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [JwtModule.register({
    secret: process.env.PRIVATE_KEY || 'secret',
  }), TypeOrmModule.forFeature([Task, Todo])],
})
export class TaskModule {
}
