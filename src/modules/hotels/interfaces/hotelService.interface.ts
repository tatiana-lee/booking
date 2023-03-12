import { Types } from 'mongoose';
import { Hotel } from '../schemas/hotel.schema';
import { SearchHotelParams } from './dto/search-hotel.dto';
import { UpdateHotelParams } from './dto/update-hotel.dto';

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: string | Types.ObjectId): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: string | Types.ObjectId, data: UpdateHotelParams): Promise<Hotel>;
}
