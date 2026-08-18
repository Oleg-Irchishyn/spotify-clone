import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @ApiProperty({ example: 'Best album in a world', description: 'Album title' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'John Doe', description: 'Album author' })
  @Prop()
  author: string;

  @ApiProperty({ example: 'album.jpg', description: 'Album picture' })
  @Prop()
  picture: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
