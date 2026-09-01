import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
  @Prop()
  name: string;

  @Prop()
  artist: string;

  @Prop()
  text?: string;

  @Prop()
  listens: number;

  @Prop()
  picture: string;

  @Prop()
  audio: string;

  @Prop({ type: [{ type: ObjectId, ref: 'Comment' }] })
  comments: Types.ObjectId[];

  // Id of the album this track belongs to, if any — a plain ObjectId, no
  // populate() across services. Catalog owns both tracks and albums itself,
  // so this reference still resolves locally; it's exactly the kind of
  // relationship that *breaks* the moment two different collections end up
  // owned by two different services with two different databases.
  @Prop({ type: ObjectId, ref: 'Album' })
  album?: Types.ObjectId;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
