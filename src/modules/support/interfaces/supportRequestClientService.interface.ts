import { Types } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support.request.schema';
import { CreateSupportRequestDto } from './dto/createSupportRequest.dto';
import { MarkMessagesAsReadDto } from './dto/markMessageAsRead.dto';

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: Types.ObjectId | string): Promise<Message[]>;
}
