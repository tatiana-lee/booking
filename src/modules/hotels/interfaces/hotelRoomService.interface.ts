import { Types } from 'mongoose';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { SearchRoomsParams } from './dto/search-room.dto';

export interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: Types.ObjectId): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: Types.ObjectId, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
