import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  // Whether the user currently holds a valid (non-expired) access token.
  @Prop({ default: false })
  isActivated: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
