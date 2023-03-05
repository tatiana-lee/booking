import { IUser } from '../user.interface';

export interface CreateUserParams {
  email: IUser['email'];
  password: IUser['password'];
  name: IUser['name'];
  contactPhone: IUser['contactPhone'];
  role: IUser['role'];
}
