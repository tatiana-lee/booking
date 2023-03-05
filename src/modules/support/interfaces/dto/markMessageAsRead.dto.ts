import { Types } from 'mongoose';

export interface MarkMessagesAsReadDto {
  user: Types.ObjectId | string;
  supportRequest: Types.ObjectId | string;
  createdBefore: Date;
}
