import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './interfaces/dto/create-hotel.dto';
import { HotelDocument } from './schemas/hotel.schema';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get(':id')
  findById(@Param() id: Types.ObjectId): Promise<HotelDocument> {
    return this.hotelsService.findById(id);
  }

  @Post()
  create(@Body() body: CreateHotelDto): Promise<HotelDocument> {
    return this.hotelsService.create(body);
  }
}
