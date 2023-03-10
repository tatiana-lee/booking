import { Injectable } from '@nestjs/common';
import { IHotelService } from './interfaces/hotelService.interface';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { CreateHotelDto } from './interfaces/dto/create-hotel.dto';
import { SearchHotelParams } from './interfaces/dto/search-hotel.dto';
import { SearchRoomsParams } from './interfaces/dto/search-room.dto';
import { UpdateHotelParams } from './interfaces/dto/update-hotel.dto';
import { IHotelRoomService } from './interfaces/hotelRoomService.interface';
import { HotelRoomDocument } from './schemas/hotel-room.schema';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(data: CreateHotelDto): Promise<HotelDocument> {
    const hotel = new this.HotelModel(data);
    return hotel.save();
  }

  findById(id: Types.ObjectId): Promise<HotelDocument> {
    return this.HotelModel.findById(id).exec();
  }

  search(params: SearchHotelParams): Promise<HotelDocument[]> {
    return this.HotelModel.find(params).exec();
  }

  update(id: Types.ObjectId, data: UpdateHotelParams): Promise<HotelDocument> {
    return this.HotelModel.findByIdAndUpdate(id, data).exec();
  }
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(Hotel.name) private HotelRoomModel: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(data: HotelRoomDocument): Promise<HotelRoomDocument> {
    const hotel = new this.HotelRoomModel(data);
    return hotel.save();
  }

  findById(id: Types.ObjectId): Promise<HotelRoomDocument> {
    return this.HotelRoomModel.findById(id).populate({ path: 'hotel' }).exec();
  }

  search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    return this.HotelRoomModel.find(params).populate({ path: 'hotel' }).exec();
  }

  update(
    id: Types.ObjectId,
    data: HotelRoomDocument,
  ): Promise<HotelRoomDocument> {
    return this.HotelRoomModel.findByIdAndUpdate(id, data).exec();
  }
}
