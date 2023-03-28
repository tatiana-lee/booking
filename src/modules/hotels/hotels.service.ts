import { Injectable } from '@nestjs/common';
import { IHotelService } from './interfaces/hotelService.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { CreateHotelDto } from './interfaces/dto/create-hotel.dto';
import { SearchHotelParams } from './interfaces/dto/search-hotel.dto';
import { SearchRoomsParams } from './interfaces/dto/search-room.dto';
import { UpdateHotelParams } from './interfaces/dto/update-hotel.dto';
import { IHotelRoomService } from './interfaces/hotelRoomService.interface';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
  ) {}

  async create(data: CreateHotelDto): Promise<HotelDocument> {
    const hotel = new this.HotelModel(data);
    return await hotel.save();
  }

  async findById(id: Types.ObjectId | string): Promise<HotelDocument> {
    if (Types.ObjectId.isValid(id)) {
      return await this.HotelModel.findById(id);
    }
  }

  async search(params: SearchHotelParams): Promise<HotelDocument[]> {
    const { limit, offset, ...rest } = params;
    return await this.HotelModel.find(rest, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async update(
    id: string | Types.ObjectId,
    data: UpdateHotelParams,
  ): Promise<HotelDocument> {
    if (Types.ObjectId.isValid(id)) {
      return this.HotelModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
    }
  }
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(data: Partial<HotelRoomDocument>): Promise<HotelRoomDocument> {
    const hotel = await new this.HotelRoomModel(data).populate({
      path: 'hotel',
    });
    return hotel.save();
  }

  async findById(id: string | Types.ObjectId): Promise<HotelRoomDocument> {
    return await this.HotelRoomModel.findById(id)
      .populate({ path: 'hotel', select: '-__v' })
      .exec();
  }

  async search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    const { limit, offset, ...rest } = params;
    return await this.HotelRoomModel.find(rest)
      .limit(limit)
      .skip(offset)
      .populate({ path: 'hotel' })
      .exec();
  }

  async update(
    id: string | Types.ObjectId,
    data: HotelRoomDocument,
  ): Promise<HotelRoomDocument> {
    return await this.HotelRoomModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate({ path: 'hotel' })
      .exec();
  }
}
