import { Module } from '@nestjs/common';
import { HotelRoomController, HotelsController } from './hotels.controller';
import { HotelRoomService, HotelsService } from './hotels.service';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [HotelsController, HotelRoomController],
  providers: [HotelsService, HotelRoomService],
  exports: [HotelsService, HotelRoomService],
})
export class HotelsModule {}
