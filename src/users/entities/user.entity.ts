import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string; // 'user', 'admin'
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
