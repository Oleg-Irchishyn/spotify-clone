import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  isActivated: boolean;
}

// The gateway verifies the JWT's signature itself — no call to auth-service
// on every request. This is what "stateless JWT" buys you: the token is
// self-contained proof of identity, so only the party that needs to *issue*
// one (auth-service) needs the database; everyone else just needs the
// shared secret to check a signature.
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }

    try {
      req.user = this.jwtService.verify<JwtPayload>(token);
      return true;
    } catch {
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
