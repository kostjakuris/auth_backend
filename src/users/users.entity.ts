import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}