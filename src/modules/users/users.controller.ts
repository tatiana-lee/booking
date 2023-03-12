import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserParams } from './interfaces/dto/create-user.dto';
import { SearchUserParams } from './interfaces/dto/search-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';
import { joiUserSchema } from './validation/joi.user.schema';
import { JoiValidationPipe } from './validation/joi.validation.pipe';

@Controller()
@UseGuards(RolesGuard)
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
  @Post('client/register')
  async create(@Request() req, @Body() body: CreateUserParams) {
    if (!req.user) {
      const user = await this.userService.create(body);
      return {
        id: user._id,
        email: user.email,
        name: user.name,
      };
    }
  }

  @Roles('admin')
  @UsePipes(new JoiValidationPipe(joiUserSchema))
  @Post('admin/users')
  async createUser(@Body() body: CreateUserParams) {
    const user = await this.userService.create(body);
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }
}
