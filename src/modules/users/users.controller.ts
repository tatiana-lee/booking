import { Controller, Get } from '@nestjs/common';
// import { SearchUserParams } from './interfaces/dto/search-user';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(): Promise<UserDocument[]> {
    return this.userService.findAll();
  }
}
