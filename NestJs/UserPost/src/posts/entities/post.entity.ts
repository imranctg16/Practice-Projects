import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
  @ApiProperty({ example: 1, description: 'The unique identifier of the post' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'My First Post', description: 'The title of the post' })
  @Column()
  title: string;

  @ApiProperty({ example: 'This is the content of my first post...', description: 'The content of the post' })
  @Column('text')
  content: string;

  @ApiProperty({ example: true, description: 'Whether the post is published' })
  @Column({ default: false })
  published: boolean;

  @ApiProperty({ example: 1, description: 'The ID of the user who created this post' })
  @Column()
  userId: number;

  @ApiProperty({ type: () => User, description: 'The user who created this post' })
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: '2023-12-01T10:00:00Z', description: 'When the post was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-12-01T10:00:00Z', description: 'When the post was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}