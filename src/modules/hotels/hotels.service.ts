import { Injectable } from '@nestjs/common';
import { IHotelService } from './interfaces/hotelService.interface';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { CreateHotelDto } from './interfaces/dto/create-hotel.dto';
import { SearchHotelParams } from './interfaces/dto/search-hotel.dto';
import { UpdateHotelParams } from './interfaces/dto/update-hotel.dto';

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
