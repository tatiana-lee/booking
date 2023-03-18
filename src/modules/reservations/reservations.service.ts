import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
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

  async addReservation(data: IReservation): Promise<ReservationDocument> {
    const roomReservations = await this.ReservationModel.find({
      room: data.room,
    });
    if (roomReservations) {
      const start = data.dateStart;
      const end = data.dateEnd;
      if (
        roomReservations.find(
          (reserv) =>
            (start <= reserv.dateStart && end >= reserv.dateEnd) ||
            (start <= reserv.dateEnd && end >= reserv.dateEnd) ||
            (start <= reserv.dateStart && end >= reserv.dateStart),
        )
      )
        return null;
    }
    const reservation = await new this.ReservationModel(data).populate({
      path: 'hotel room',
    });
    return reservation.save();
  }

  async removeReservation(
    id: string | Types.ObjectId,
    user?: UserDocument,
  ): Promise<void> {
    const reservation = await this.ReservationModel.findById(id);
    if (!reservation) throw new BadRequestException();
    if (user._id !== reservation.user) throw new ForbiddenException();
    await this.ReservationModel.findByIdAndRemove(id);
    return;
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<ReservationDocument[]> {
    return await this.ReservationModel.find(filter)
      .populate({ path: 'hotel room' })
      .exec();
  }
}
