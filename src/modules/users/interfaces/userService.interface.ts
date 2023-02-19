import { Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { SearchUserParams } from './dto/search-user.dto';

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: Types.ObjectId): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}
