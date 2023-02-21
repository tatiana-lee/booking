import { Date, Types } from 'mongoose';

export interface IReservation {
  userId: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomId: Types.ObjectId;
  dateStart: Date;
  dateEnd: Date;
}
