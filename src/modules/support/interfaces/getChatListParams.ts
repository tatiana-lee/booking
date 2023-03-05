import { Types } from 'mongoose';

export interface GetChatListParams {
  user: Types.ObjectId | null;
  isActive: boolean;
}
