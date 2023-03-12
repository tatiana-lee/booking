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

@Controller()
@UseGuards(RolesGuard)
export class HotelRoomController implements IHotelRoomService {
  constructor(private readonly hotelRoomService: HotelRoomService) {}

  @Get('common/hotel-rooms')
  search(@Query() params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    return this.hotelRoomService.search(params);
  }

  @Get('common/hotel-rooms:id')
  findById(@Param('id') id: Types.ObjectId): Promise<HotelRoomDocument> {
    return this.hotelRoomService.findById(id);
  }

  @Roles('admin')
  @Post('admin/hotel-rooms')
  create(@Body() body: HotelRoomDocument): Promise<HotelRoomDocument> {
    return this.hotelRoomService.create(body);
  }

  @Roles('admin')
  @Put('admin/hotel-rooms/:id')
  update(
    @Param('id') id: string | Types.ObjectId,
    @Body() data: HotelRoomDocument,
  ): Promise<HotelRoomDocument> {
    return this.hotelRoomService.update(id, data);
  }
}

@Controller('admin/hotels')
@UseGuards(RolesGuard)
export class HotelsController implements IHotelService {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get(':id')
  @Roles('admin')
  findById(@Param('id') id: Types.ObjectId): Promise<HotelDocument> {
    return this.hotelsService.findById(id);
  }

  @Get()
  @Roles('admin')
  search(@Query() params: SearchHotelParams): Promise<HotelDocument[]> {
    return this.hotelsService.search(params);
  }

  @Roles('admin')
  @Post()
  async create(@Body() data: CreateHotelDto) {
    const hotel = await this.hotelsService.create(data);
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Roles('admin')
  @Put(':id')
  update(
    @Param('id') id: string | Types.ObjectId,
    @Body() data: UpdateHotelParams,
  ): Promise<HotelDocument> {
    return this.hotelsService.update(id, data);
  }
}
