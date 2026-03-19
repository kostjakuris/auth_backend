import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  
  @ManyToMany(() => Room, (room) => room.users)
  @JoinTable()
  rooms: Room[];
}