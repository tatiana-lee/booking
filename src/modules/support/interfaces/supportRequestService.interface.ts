import { Types } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support.request.schema';
import { SendMessageDto } from './dto/sendMessage.dto';
import { GetChatListParams } from './getChatListParams';

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: Types.ObjectId | string): Promise<Message[]>;
  // subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void,
  // ): () => void;
}
