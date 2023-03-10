import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HotelsService, HotelRoomService } from './hotels.service';
import { CreateHotelDto } from './interfaces/dto/create-hotel.dto';
import { SearchHotelParams } from './interfaces/dto/search-hotel.dto';
import { SearchRoomsParams } from './interfaces/dto/search-room.dto';
import { UpdateHotelParams } from './interfaces/dto/update-hotel.dto';
import { IHotelRoomService } from './interfaces/hotelRoomService.interface';
import { IHotelService } from './interfaces/hotelService.interface';
import { HotelRoomDocument } from './schemas/hotel-room.schema';
import { HotelDocument } from './schemas/hotel.schema';

@Controller('common/hotel-rooms')
export class HotelRoomController implements IHotelRoomService {
  constructor(private readonly hotelRoomService: HotelRoomService) {}

  @Get(':id')
  findById(@Param() id: Types.ObjectId): Promise<HotelRoomDocument> {
    return this.hotelRoomService.findById(id);
  }

  @Post()
  create(@Body() body: any): Promise<HotelRoomDocument> {
    return this.hotelRoomService.create(body);
  }

  @Get()
  search(@Query() params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    return this.hotelRoomService.search(params);
  }

  @Put()
  update(
    id: Types.ObjectId,
    data: HotelRoomDocument,
  ): Promise<HotelRoomDocument> {
    return this.hotelRoomService.update(id, data);
  }
}

@Controller('admin')
@UseGuards(RolesGuard)
export class HotelsController implements IHotelService {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get(':id')
  // @Roles('admin')
  findById(@Param() id: Types.ObjectId): Promise<HotelDocument> {
    return this.hotelsService.findById(id);
  }

  @Get()
  @Roles('admin')
  search(@Query() params: SearchHotelParams): Promise<HotelDocument[]> {
    return this.hotelsService.search(params);
  }

  @Roles('admin')
  @Post('hotels')
  async create(@Body() data: CreateHotelDto) {
    const hotel = await this.hotelsService.create(data);
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Put()
  update(id: Types.ObjectId, data: UpdateHotelParams): Promise<HotelDocument> {
    return this.hotelsService.update(id, data);
  }
}
