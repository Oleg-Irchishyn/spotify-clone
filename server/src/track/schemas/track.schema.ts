import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
  @ApiProperty({
    example: 'Bohemian Rhapsody',
    description: 'Name of the track',
  })
  @Prop()
  name: string;

  @ApiProperty({ example: 'Queen', description: 'Name of the artist' })
  @Prop()
  artist: string;

  @ApiProperty({
    required: false,
    example: 'Is this the real life...',
    description: 'Track lyrics/text',
  })
  @Prop()
  text?: string;

  @ApiProperty({
    example: 0,
    description: 'Number of times the track has been listened to',
  })
  @Prop()
  listens: number;

  @ApiProperty({
    example: 'image/uuid.jpg',
    description: 'Path to the track picture',
  })
  @Prop()
  picture: string;

  @ApiProperty({
    example: 'audio/uuid.mp3',
    description: 'Path to the track audio file',
  })
  @Prop()
  audio: string;

  @ApiProperty({
    type: [String],
    example: ['6a7590b7d7df3f35611c8e7a'],
    description: 'List of comment ids left on the track',
  })
  @Prop({ type: [{ type: ObjectId, ref: 'Comment' }] })
  comments: Types.ObjectId[];

  @ApiProperty({
    required: false,
    example: '6a7590b7d7df3f35611c8e7a',
    description: 'Id of the album this track belongs to, if any',
  })
  @Prop({ type: ObjectId, ref: 'Album' })
  album?: Types.ObjectId;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
