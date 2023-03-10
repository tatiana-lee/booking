import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HotelDocument } from './hotel.schema';

export type HotelRoomDocument = HotelRoom & Document;

@Schema({ timestamps: true })
export class HotelRoom {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotel: HotelDocument;

  @Prop()
  description: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ required: true, default: true })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
