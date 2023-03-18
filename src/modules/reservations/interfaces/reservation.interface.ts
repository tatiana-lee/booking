import { Date, Types } from 'mongoose';

export interface IReservation {
  user: string | Types.ObjectId;
  hotel: string | Types.ObjectId;
  room: string | Types.ObjectId;
  dateStart: Date;
  dateEnd: Date;
}
