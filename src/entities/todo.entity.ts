import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './users.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @OneToMany(() => Task, task => task.todo, {onDelete: 'CASCADE'})
  tasks: Task[];
  
  @ManyToOne(() => User, user => user.todos)
  user: User;
}