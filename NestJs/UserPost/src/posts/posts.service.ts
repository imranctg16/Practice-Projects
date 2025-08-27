import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      userId,
    });

    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPublished(): Promise<Post[]> {
    return this.postsRepository.find({
      where: { published: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Post[]> {
    return this.postsRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.findOne(id);

    // Check if the user owns this post
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOne(id);

    // Check if the user owns this post
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
  }

  async publish(id: number, userId: number): Promise<Post> {
    const post = await this.findOne(id);

    // Check if the user owns this post
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only publish your own posts');
    }

    post.published = true;
    return this.postsRepository.save(post);
  }

  async unpublish(id: number, userId: number): Promise<Post> {
    const post = await this.findOne(id);

    // Check if the user owns this post
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only unpublish your own posts');
    }

    post.published = false;
    return this.postsRepository.save(post);
  }
}