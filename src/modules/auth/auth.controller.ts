import {
  Controller,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.auth.guards';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { email, name, contactPhone } = req.user;
    return { email, name, contactPhone };
  }

  @Post('logout')
  logout(@Request() req, @Response() res) {
    if (req.user) {
      req.session.destroy();
      res.send('success');
    } else {
      throw new UnauthorizedException();
    }
  }
}
