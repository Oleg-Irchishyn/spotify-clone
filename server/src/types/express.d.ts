import { JwtPayload } from 'src/guards/jwt-auth.guard';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
