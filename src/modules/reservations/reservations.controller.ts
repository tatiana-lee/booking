import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReservationSearchOptions } from './interfaces/dto/reservationSearch.dto';
import { IReservation } from './interfaces/reservation.interface';
import { ReservationsService } from './reservations.service';
import { ReservationDocument } from './schemas/reservation.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @Get()
  getReservations(
    @Body() body: ReservationSearchOptions,
  ): Promise<ReservationDocument[]> {
    return this.reservationService.getReservations(body);
  }

  @Post()
  addReservation(@Body() data: IReservation): Promise<ReservationDocument> {
    return this.reservationService.addReservation(data);
  }

  @Post(':id')
  removeReservation(@Param() id: Types.ObjectId): Promise<void> {
    return this.reservationService.removeReservation(id);
  }
}
