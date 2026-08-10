import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
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

  @ApiProperty({
    example: '1',
    description: 'List of tracks in the album',
  })
  @Prop({ type: [{ type: ObjectId, ref: 'Track' }] })
  tracks: Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
