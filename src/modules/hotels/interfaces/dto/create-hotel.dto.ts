import { IHotel } from '../hotel.interface';

export interface CreateHotelDto {
  title: IHotel['title'];
  description: IHotel['description'];
}
