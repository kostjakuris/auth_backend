import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column()
  ownerId: number;
  
  @Column({nullable: true, default: ''})
  avatar: string;
  
  @ManyToMany(() => User, (user) => user.rooms, {eager: true, onDelete: 'CASCADE'})
  users: User[];
}