import { Types } from 'mongoose';

export interface SendMessageDto {
  author: Types.ObjectId | string;
  supportRequest: Types.ObjectId | string;
  text: string;
}
