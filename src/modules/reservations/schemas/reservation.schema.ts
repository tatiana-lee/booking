import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Types } from 'mongoose';
import { Hotel } from 'src/modules/hotels/schemas/hotel.schema';
import { HotelRoom } from 'src/modules/hotels/schemas/hotel-room.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotelId: Hotel;

  @Prop({ required: true, type: Types.ObjectId, ref: 'HotelRoom' })
  roomId: HotelRoom;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
