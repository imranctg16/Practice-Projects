import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Post } from '../../posts/entities/post.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Column()
  name: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ example: '2023-12-01T10:00:00Z', description: 'When the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-12-01T10:00:00Z', description: 'When the user was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => [Post], description: 'Posts created by the user' })
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}