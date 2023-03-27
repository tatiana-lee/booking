import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateSupportRequestDto } from './interfaces/dto/createSupportRequest.dto';
import { MarkMessagesAsReadDto } from './interfaces/dto/markMessageAsRead.dto';
import { SendMessageDto } from './interfaces/dto/sendMessage.dto';
import { GetChatListParams } from './interfaces/getChatListParams';
import { SupportRequestDocument } from './schemas/support.request.schema';
import { SupportGateway } from './support.gateway';
import { SupportRequestClientService, SupportService } from './support.service';

@UseGuards(RolesGuard)
@Controller('client/support-requests')
export class SupportClientController {
  constructor(
    private readonly supportRequestService: SupportService,
    private readonly supportRequestClientService: SupportRequestClientService,
  ) {}

  @Roles('client')
  @Post()
  async createSupportRequest(
    @Body() body: CreateSupportRequestDto,
    @Request() req,
  ) {
    const user = req.user;
    const newSupportRequest =
      await this.supportRequestClientService.createSupportRequest({
        user: user._id,
        text: body.text,
      });

    await this.supportRequestService.sendMessage(
      {
        author: user._id,
        supportRequest: newSupportRequest['_id'],
        text: body.text,
      },
      user,
    );

    return [
      {
        id: newSupportRequest['_id'],
        createdAt: newSupportRequest['createdAt'],
        isActive: true,
        hasNewMessages: false,
      },
    ];
  }

  @Roles('client')
  @Get()
  async getSupportRequests(
    @Request() req,
    @Query() params: GetChatListParams,
  ): Promise<SupportRequestDocument[]> {
    const userId = req.user._id;
    return await this.supportRequestService.findSupportRequests({
      ...params,
      user: userId,
    });
  }
}

@UseGuards(RolesGuard)
@Controller('manager/support-requests')
export class SupportManagerController {
  constructor(private readonly supportRequestService: SupportService) {}

  @Roles('manager')
  @Get()
  async getSupportRequests(@Query() params: GetChatListParams) {
    return await this.supportRequestService.findSupportRequests(params);
  }
}

@UseGuards(RolesGuard)
@Controller('common/support-requests')
export class SupportController {
  constructor(
    private readonly supportRequestService: SupportService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportGateway: SupportGateway,
  ) {}

  @Roles('manager', 'client')
  @Get(':id/messages')
  async getSupportRequestsMessages(
    @Param('id') id: string | Types.ObjectId,
    @Request() req,
  ) {
    const user = req.user;
    return await this.supportRequestService.getMessages(
      id,
      user.role === 'client' ? user : false,
    );
  }

  @Roles('manager', 'client')
  @Post(':id/messages')
  async sendMessages(
    @Param('id') supportId: string | Types.ObjectId,
    @Request() req,
    @Body() body: SendMessageDto,
  ) {
    const user = req.user;
    const message = await this.supportRequestService.sendMessage(
      {
        author: user._id,
        supportRequest: supportId,
        text: body.text,
      },
      user.role === 'client' ? user : false,
    );

    this.supportGateway.ws
      .to(supportId.toString())
      .emit('new-message', message);
  }

  @Roles('manager', 'client')
  @Post(':id/messages/read')
  async markMessagesAsRead(
    @Param('id') messageId: string | Types.ObjectId,
    @Body() body: MarkMessagesAsReadDto,
    @Request() req,
  ) {
    const user = req.user._id;
    const request = await this.supportRequestClientService.markMessagesAsRead({
      supportRequest: messageId,
      user: user,
      createdBefore: new Date(),
    });

    if (request) {
      return {
        success: true,
      };
    }
  }
}
