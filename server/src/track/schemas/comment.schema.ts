import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @ApiProperty({
    example: 'John Doe',
    description: 'Username of the comment author',
  })
  @Prop()
  username: string;

  @ApiProperty({ example: 'Great track!', description: 'Comment text' })
  @Prop()
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
