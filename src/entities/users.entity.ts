import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({default: ''})
  username: string;
  
  @Column()
  email: string;
  
  @Column()
  password: string;
  
  @OneToMany(() => Todo, todo => todo.user)
  todos: Todo[];
}