import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateSupportRequestDto } from './interfaces/dto/createSupportRequest.dto';
import { MarkMessagesAsReadDto } from './interfaces/dto/markMessageAsRead.dto';
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
        throw new ForbiddenException();
      }

      const message = new this.MessageModel(data);
      await message.save();
      await this.SupportRequestModel.findByIdAndUpdate(
        data.supportRequest,
        {
          $push: { messages: message },
        },
        { new: true },
      );
      return message.populate({ path: 'author', select: '-password' });
    }
  }

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequestDocument[]> {
    const { limit, offset = 0, ...rest } = params;
    const request = this.SupportRequestModel.find(rest)
      .populate('messages')
      .limit(limit)
      .skip(offset);
    if (!rest.user) request.populate({ path: 'user', select: '-password' });

    return await request.exec();
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
      select: '-password -email',
    });

    if (user && request.user !== user._id) {
      throw new ForbiddenException();
    }

    return request.messages;
  }
}

@Injectable()
export class SupportRequestClientService {
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequestDocument> {
    const supportRequest = new this.SupportRequestModel(data);
    return await supportRequest.save();
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const { user, supportRequest, createdBefore } = params;
    const request = await this.SupportRequestModel.findById(supportRequest)
      .populate({
        path: 'messages.author',
        model: 'User',
        select: '-password',
      })
      .populate({
        path: 'user',
        model: 'User',
        select: '-password',
      });

    if (request.user['_id'].toString() !== user) {
      throw new ForbiddenException();
    }
    request.messages.map((msg) => {
      const sentAt = new Date(msg.sentAt);
      if (
        sentAt <= createdBefore &&
        msg.author['_id'] !== user &&
        !msg.readAt
      ) {
        msg.readAt = new Date().toISOString();
      }
    });
    await this.SupportRequestModel.findByIdAndUpdate(
      supportRequest,
      { messages: request.messages },
      { new: true },
    );
    return request;
  }
}
