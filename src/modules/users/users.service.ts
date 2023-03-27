import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { IUserService } from './interfaces/userService.interface';
import { SearchUserParams } from './interfaces/dto/search-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserParams } from './interfaces/dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: CreateUserParams): Promise<UserDocument> {
    const { email } = data;
    const isExist = await this.UserModel.findOne({ email: email }).exec();
    if (isExist) {
      throw new BadRequestException({
        error: 'Пользователь с таким email уже существует',
      });
    }

    data.password = await bcryptjs.hash(data.password, 8);
    const user = new this.UserModel(data);
    return await user.save();
  }

  findById(id: Types.ObjectId | string): Promise<UserDocument> {
    const user = this.UserModel.findById(id).exec();

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({ email: email }).select('-__v');

    return user;
  }

  async findAll(params: SearchUserParams): Promise<UserDocument[]> {
    const { limit, offset, ...rest } = params;
    return await this.UserModel.find(rest, { password: 0, __v: 0, role: 0 })
      .limit(limit)
      .skip(offset)
      .exec();
  }
}
