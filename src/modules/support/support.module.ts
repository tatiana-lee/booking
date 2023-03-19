import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support.request.schema';
import {
  SupportClientController,
  SupportController,
  SupportManagerController,
} from './support.controller';
import { SupportRequestClientService, SupportService } from './support.service';
import { SupportGateway } from './support.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [
    SupportClientController,
    SupportManagerController,
    SupportController,
  ],
  providers: [SupportService, SupportRequestClientService, SupportGateway],
  exports: [SupportService, SupportRequestClientService],
})
export class SupportModule {}
