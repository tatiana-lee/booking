import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const comparedPassword = await bcryptjs.compare(password, user.password);
    if (user && comparedPassword) {
      return user;
    }
    return null;
  }
}
