import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from 'src/users/users.service';

import { JwtAuthGuard } from '../jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: { verify: jest.Mock; decode: jest.Mock };
  let usersService: { setActivated: jest.Mock };

  const buildContext = (
    headers: Record<string, string> = {},
    cookies: Record<string, string> = {},
  ): { context: ExecutionContext; req: Record<string, unknown> } => {
    const req: Record<string, unknown> = { headers, cookies };
    const context = {
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;

    return { context, req };
  };

  beforeEach(async () => {
    jwtService = { verify: jest.fn(), decode: jest.fn() };
    usersService = { setActivated: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: jwtService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('throws UnauthorizedException when the Authorization header is missing', async () => {
    const { context } = buildContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when the scheme is not Bearer', async () => {
    const { context } = buildContext({ authorization: 'Basic abc' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when the token is missing after Bearer', async () => {
    const { context } = buildContext({ authorization: 'Bearer ' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('attaches the decoded payload to the request and allows access for a valid token', async () => {
    const payload = {
      id: 'id1',
      email: 'a@test.com',
      name: 'A',
      isActivated: true,
    };
    jwtService.verify.mockReturnValue(payload);
    const { context, req } = buildContext({
      authorization: 'Bearer valid-token',
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(req.user).toEqual(payload);
  });

  it('reads the token from an httpOnly cookie when no Authorization header is present', async () => {
    const payload = {
      id: 'id1',
      email: 'a@test.com',
      name: 'A',
      isActivated: true,
    };
    jwtService.verify.mockReturnValue(payload);
    const { context } = buildContext({}, { token: 'cookie-token' });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtService.verify).toHaveBeenCalledWith('cookie-token');
  });

  it('prefers the cookie over the Authorization header when both are present', async () => {
    jwtService.verify.mockReturnValue({ email: 'a@test.com' });
    const { context } = buildContext(
      { authorization: 'Bearer header-token' },
      { token: 'cookie-token' },
    );

    await guard.canActivate(context);

    expect(jwtService.verify).toHaveBeenCalledWith('cookie-token');
  });

  it('throws UnauthorizedException without deactivating the user when the token is simply invalid', async () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid signature');
    });
    const { context } = buildContext({ authorization: 'Bearer bad-token' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(usersService.setActivated).not.toHaveBeenCalled();
  });

  it('deactivates the user by email when the token has expired', async () => {
    jwtService.verify.mockImplementation(() => {
      throw new TokenExpiredError('jwt expired', new Date());
    });
    jwtService.decode.mockReturnValue({ email: 'a@test.com' });
    const { context } = buildContext({
      authorization: 'Bearer expired-token',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(usersService.setActivated).toHaveBeenCalledWith('a@test.com', false);
  });

  it('does not call setActivated when the expired token cannot be decoded', async () => {
    jwtService.verify.mockImplementation(() => {
      throw new TokenExpiredError('jwt expired', new Date());
    });
    jwtService.decode.mockReturnValue(null);
    const { context } = buildContext({
      authorization: 'Bearer expired-token',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(usersService.setActivated).not.toHaveBeenCalled();
  });
});
