import { IUser } from '../user.interface';

export interface CreateUserParams {
  email: IUser['email'];
  password: IUser['passwordHash'];
  name: IUser['name'];
  contactPhone: IUser['contactPhone'];
  role: IUser['role'];
}
