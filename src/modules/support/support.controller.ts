import { Controller, Get, Post, Put } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportRequestService: SupportService) {}

  // @Post()

}
