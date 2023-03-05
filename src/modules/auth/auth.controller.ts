import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { email, name, contactPhone } = req.user;
    return { email, name, contactPhone };
  }

  @Post('logout')
  logout(@Request() req) {
    req.session.destroy();
  }
}
