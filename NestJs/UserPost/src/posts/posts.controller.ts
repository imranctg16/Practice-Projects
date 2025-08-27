import {
  Controller,
  Get,
  Post as PostMethod,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Post } from './entities/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @PostMethod()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: Post,
  })
  create(@Body() createPostDto: CreatePostDto, @Request() req): Promise<Post> {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ 
    name: 'published', 
    required: false, 
    type: 'boolean',
    description: 'Filter by published status (true for published posts only)' 
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    type: 'number',
    description: 'Filter posts by user ID' 
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts',
    type: [Post],
  })
  findAll(
    @Query('published') published?: string,
    @Query('userId') userId?: string,
  ): Promise<Post[]> {
    if (userId) {
      return this.postsService.findByUser(+userId);
    }
    
    if (published === 'true') {
      return this.postsService.findPublished();
    }
    
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'The post details',
    type: Post,
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: 'number', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: Post,
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 403, description: 'You can only update your own posts.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<Post> {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', type: 'number', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 403, description: 'You can only delete your own posts.' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    return this.postsService.remove(id, req.user.userId);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Publish a post' })
  @ApiParam({ name: 'id', type: 'number', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully published.',
    type: Post,
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 403, description: 'You can only publish your own posts.' })
  publish(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Post> {
    return this.postsService.publish(id, req.user.userId);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Unpublish a post' })
  @ApiParam({ name: 'id', type: 'number', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully unpublished.',
    type: Post,
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 403, description: 'You can only unpublish your own posts.' })
  unpublish(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Post> {
    return this.postsService.unpublish(id, req.user.userId);
  }
}