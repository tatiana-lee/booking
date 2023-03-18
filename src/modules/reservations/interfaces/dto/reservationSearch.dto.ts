import { IReservation } from '../reservation.interface';

export interface ReservationSearchOptions {
  user: IReservation['user'];
  dateStart?: IReservation['dateStart'];
  dateEnd?: IReservation['dateEnd'];
}
