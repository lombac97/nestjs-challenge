import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'first_name',
    type: 'char',
    length: 40,
    nullable: true,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'char',
    length: 40,
    nullable: true,
  })
  lastName: string;

  @Column({
    name: 'email',
    type: 'char',
    length: 40,
    unique: true,
    nullable: true,
  })
  email: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @Exclude()
  @Column({
    name: 'password',
    type: 'char',
    length: 80,
    nullable: false,
  })
  password: string;

  @Exclude()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: null,
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: null,
  })
  updateAt: Date;

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
  })
  deletedAt: Date;
}
