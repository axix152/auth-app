// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, minlength: 3, maxlength: 20 })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true, match: /.+\@.+\..+/ }) // Ensure email is unique and matches email pattern
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
