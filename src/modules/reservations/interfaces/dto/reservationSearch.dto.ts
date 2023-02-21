import { IReservation } from '../reservation.interface';

export interface ReservationSearchOptions {
  userId: IReservation['userId'];
  dateStart: IReservation['dateStart'];
  dateEnd: IReservation['dateEnd'];
}
