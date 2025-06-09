import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Todo } from '../entities/todo.entity';
import * as process from 'node:process';
import { Task } from '../entities/task.entity';
import { User } from '../entities/users.entity';
import { UsersModule } from '../users/users.module';


@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [UsersModule, JwtModule.register({
    secret: process.env.PRIVATE_KEY || 'secret',
  }), TypeOrmModule.forFeature([Todo, Task, User])],
  exports: [TodoService]
})
export class TodoModule {
}
