import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Types } from 'mongoose';
import { Hotel } from 'src/modules/hotels/schemas/hotel.schema';
import { HotelRoom } from 'src/modules/hotels/schemas/hotel-room.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotel: Hotel;

  @Prop({ required: true, type: Types.ObjectId, ref: 'HotelRoom' })
  room: HotelRoom;

  @Prop({ required: true, type: Date })
  dateStart: Date;

  @Prop({ required: true, type: Date })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
