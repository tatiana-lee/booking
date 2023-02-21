import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { ReservationSearchOptions } from './interfaces/dto/reservationSearch.dto';
import { IReservation } from './interfaces/reservation.interface';
import { IReservationService } from './interfaces/reservationService.interface';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';

@Injectable()
export class ReservationsService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private ReservationModel: Model<ReservationDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  addReservation(data: IReservation): Promise<ReservationDocument> {
    const reservation = new this.ReservationModel(data);
    return reservation.save();
  }

  removeReservation(id: Types.ObjectId): Promise<void> {
    this.ReservationModel.findByIdAndRemove(id);
    return;
  }

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<ReservationDocument[]> {
    return this.ReservationModel.find(filter).exec();
  }
}
