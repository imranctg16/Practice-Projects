import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'This is the content of my first post. It contains some interesting information.',
    description: 'The content of the post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: false,
    description: 'Whether the post should be published immediately',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}