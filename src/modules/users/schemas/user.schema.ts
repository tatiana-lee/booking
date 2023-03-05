import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  contactPhone: string;

  @Prop({
    ofString: ['client', 'admin', 'manager'],
    required: true,
    default: 'client',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
