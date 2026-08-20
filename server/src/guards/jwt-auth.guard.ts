import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

import { UsersService } from 'src/users/users.service';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  isActivated: boolean;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }

    try {
      req.user = this.jwtService.verify<JwtPayload>(token);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const payload = this.jwtService.decode<JwtPayload>(token);
        if (payload?.email) {
          await this.usersService.setActivated(payload.email, false);
        }
      }
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }
  }
}
