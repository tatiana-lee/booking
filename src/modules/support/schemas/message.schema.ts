import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ required: true, type: Date, default: Date.now })
  sentAt: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Date })
  readAt: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
