import { Types } from 'mongoose';

export interface CreateSupportRequestDto {
  user: Types.ObjectId | string;
  text: string;
}
