import { JwtPayload } from '../guards/jwt.guard';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
