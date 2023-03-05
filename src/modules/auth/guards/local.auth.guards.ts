import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  public handleRequest(err: any, user: any) {
    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
