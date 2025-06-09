import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from './todo.entity';

export enum Status {
  toDo = 'to do',
  inProgress = 'in progress',
  done = 'done',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column({default: ''})
  description: string;
  
  @ManyToOne(() => Todo, todo => todo.tasks, {onDelete: 'CASCADE'})
  todo: Todo;
  
  @Column({type: 'enum', enum: Status, default: Status.toDo})
  status: Status;
  
  @Column({nullable: true})
  parentId: number;
}