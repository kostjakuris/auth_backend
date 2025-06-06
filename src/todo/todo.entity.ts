import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../task/task.entity';
import { User } from '../users/users.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @OneToMany(() => Task, task => task.todo)
  tasks: Task[];
  
  @ManyToOne(() => User, user => user.todos)
  user: User;
}