import { Controller, Get, Post, Body, Param, UsePipes } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateUserParams } from './interfaces/dto/create-user.dto';
import { SearchUserParams } from './interfaces/dto/search-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';
import { joiUserSchema } from './validation/joi.user.schema';
import { JoiValidationPipe } from './validation/joi.validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(@Body() params: SearchUserParams): Promise<UserDocument[]> {
    return this.userService.findAll(params);
  }

  @Get(':id')
  findById(@Param() id: Types.ObjectId): Promise<UserDocument> {
    return this.userService.findById(id);
  }
  @UsePipes(new JoiValidationPipe(joiUserSchema))
  @Post()
  create(@Body() body: CreateUserParams): Promise<UserDocument> {
    return this.userService.create(body);
  }
}
