import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from './todo.entity';
import { Room } from './room.entity';

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
  
  @ManyToMany(() => Room, (room) => room.users)
  @JoinTable()
  rooms: Room[];
}