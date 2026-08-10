import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Username of the comment author',
  })
  @IsString({ message: 'Should be in string format' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  readonly username: string;

  @ApiProperty({ example: 'Great track!', description: 'Comment text' })
  @IsString({ message: 'Should be in string format' })
  @IsNotEmpty({ message: 'Text cannot be empty' })
  readonly text: string;

  @ApiProperty({
    example: '6a7485cf67bffb02319c73b4',
    description: 'Id of the track this comment belongs to',
  })
  @IsMongoId({ message: 'trackId should be a valid Mongo id' })
  readonly trackId: string;
}
