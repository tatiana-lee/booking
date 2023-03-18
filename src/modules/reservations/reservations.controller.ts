import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Delete,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HotelRoomService } from '../hotels/hotels.service';
import { IReservation } from './interfaces/reservation.interface';
import { ReservationsService } from './reservations.service';
import { ReservationDocument } from './schemas/reservation.schema';

@UseGuards(RolesGuard)
@Controller()
export class ReservationsController {
  constructor(
    private readonly reservationService: ReservationsService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Roles('client')
  @Get('client/reservations')
  getReservations(@Request() req): Promise<ReservationDocument[]> {
    return this.reservationService.getReservations({ user: req.user._id });
  }

  @Roles('client')
  @Post('client/reservations')
  async addReservation(
    @Body() data: IReservation,
    @Request() req,
  ): Promise<ReservationDocument> {
    const userId = req.user._id;
    const room = await this.hotelRoomService.findById(data.room);
    if (!room || !room.isEnabled) throw new BadRequestException();

    const newData = { ...data, user: userId, hotel: room.hotel._id };
    return await this.reservationService.addReservation(newData);
  }

  @Roles('client')
  @Delete('client/reservations/:id')
  removeReservation(
    @Param('id') id: string | Types.ObjectId,
    @Request() req,
  ): Promise<void> {
    const user = req.user;
    return this.reservationService.removeReservation(id, user);
  }

  @Roles('manager')
  @Get('manager/reservations/:id')
  getReservationsByManager(
    @Param('id') id: string | Types.ObjectId,
  ): Promise<ReservationDocument[]> {
    return this.reservationService.getReservations({ user: id });
  }

  @Roles('manager')
  @Delete('manager/reservations/:id')
  removeReservationByManager(
    @Param('id') id: string | Types.ObjectId,
  ): Promise<void> {
    return this.reservationService.removeReservation(id);
  }
}
