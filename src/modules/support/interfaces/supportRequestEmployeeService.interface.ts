import { Types } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { MarkMessagesAsReadDto } from './dto/markMessageAsRead.dto';

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: Types.ObjectId | string): Promise<Message[]>;
  closeRequest(supportRequest: Types.ObjectId | string): Promise<void>;
}
