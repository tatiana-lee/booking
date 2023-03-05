import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { IUserService } from './interfaces/userService.interface';
import { SearchUserParams } from './interfaces/dto/search-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserParams } from './interfaces/dto/create-user.dto';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(data: CreateUserParams): Promise<UserDocument> {
    const user = new this.UserModel(data);

    return user.save();
  }

  findById(id: Types.ObjectId): Promise<UserDocument> {
    const user = this.UserModel.findById(id).exec();

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({ email: email }).select(
      '-__v password',
    );

    return user;
  }

  async findAll(params: SearchUserParams): Promise<UserDocument[]> {
    const { limit, offset = 0, ...rest } = params;
    const users = this.UserModel.find(rest, { password: 0, __v: 0 }).skip(
      offset,
    );
    if (limit) users.limit(limit);

    return await users.exec();
  }
}
