import { UserDocument } from '../schemas/user.schema';
import { SearchUserParams } from './dto/search-user';

export interface IUserService {
  create(data: Partial<UserDocument>): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument>;
  findAll(params: SearchUserParams): Promise<UserDocument[]>;
}
