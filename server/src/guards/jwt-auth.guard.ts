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
    const token = this.extractToken(req);

    if (!token) {
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

  private extractToken(req: Request): string | undefined {
    const cookieToken = (req.cookies as Record<string, string> | undefined)
      ?.token;

    if (cookieToken) {
      return cookieToken;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [bearer, headerToken] = authHeader.split(' ');

    return bearer === 'Bearer' && headerToken ? headerToken : undefined;
  }
}
