import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: '12345', description: 'Password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: false,
    description:
      'Whether the user currently holds a valid (non-expired) access token',
  })
  @Prop({ default: false })
  isActivated: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
