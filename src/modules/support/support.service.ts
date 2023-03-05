import { Injectable, HttpException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { SendMessageDto } from './interfaces/dto/sendMessage.dto';
import { GetChatListParams } from './interfaces/getChatListParams';
import { ISupportRequestService } from './interfaces/supportRequestService.interface';
import { Message, MessageDocument } from './schemas/message.schema';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support.request.schema';

@Injectable()
export class SupportService implements ISupportRequestService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async sendMessage(
    data: SendMessageDto,
    user?: UserDocument,
  ): Promise<MessageDocument> {
    const supportRequest = await this.SupportRequestModel.findById(
      data.supportRequest,
    );
    if (supportRequest) {
      if (user && supportRequest.user !== user._id) {
        throw new HttpException('Доступ запрещен', 403);
      }

      const message = new this.MessageModel(data);
      await this.SupportRequestModel.findByIdAndUpdate(data.supportRequest, {
        $push: { messages: message },
      });
      return message;
    }
  }

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    // const { limit, offset = 0, ...rest } = params;
    const request = await this.SupportRequestModel.find(params)
      .populate('user')
      .exec();
    // if (!rest.user) request.populate('user')
    // if (limit) request.limit(limit)

    return request;
  }

  async getMessages(
    supportRequest: Types.ObjectId | string,
    user?: UserDocument,
  ): Promise<Message[]> {
    const request = await this.SupportRequestModel.findById(
      supportRequest,
    ).populate({
      path: 'messages.author',
      model: 'User',
    });

    if (user && request.user !== user._id) {
      throw new HttpException('Доступ запрещен', 403);
    }
    //.select({ __v: 0 })
    //.populate('messages.author')
    return request.messages;
  }
}
