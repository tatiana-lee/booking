import { Types } from 'mongoose';
import { Reservation } from '../schemas/reservation.schema';
import { ReservationSearchOptions } from './dto/reservationSearch.dto';
import { IReservation } from './reservation.interface';

export interface IReservationService {
  addReservation(data: IReservation): Promise<Reservation>;
  removeReservation(id: string | Types.ObjectId): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
