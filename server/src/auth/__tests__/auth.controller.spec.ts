import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';

import { UsersService } from 'src/users/users.service';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    login: jest.Mock;
    registration: jest.Mock;
    logout: jest.Mock;
    getCurrentUser: jest.Mock;
  };
  let res: { cookie: jest.Mock; clearCookie: jest.Mock };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      registration: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
    };
    res = { cookie: jest.fn(), clearCookie: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
        { provide: UsersService, useValue: { setActivated: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login()', () => {
    const dto = { email: 'a@test.com', password: '12345' };
    const user = { email: 'a@test.com', name: 'A', isActivated: true };

    it('delegates to authService.login with the dto', async () => {
      authService.login.mockResolvedValue({ token: 't', user });

      await controller.login(dto, res as unknown as Response);

      expect(authService.login).toHaveBeenCalledWith(dto);
    });

    it('sets the token as an httpOnly cookie and returns only the user', async () => {
      authService.login.mockResolvedValue({ token: 'signed-token', user });

      const result = await controller.login(dto, res as unknown as Response);

      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'signed-token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result).toEqual({ user });
    });
  });

  describe('registration()', () => {
    const dto = { email: 'a@test.com', name: 'A', password: '12345' };
    const user = { email: 'a@test.com', name: 'A', isActivated: true };

    it('delegates to authService.registration with the dto', async () => {
      authService.registration.mockResolvedValue({ token: 't', user });

      await controller.registration(dto, res as unknown as Response);

      expect(authService.registration).toHaveBeenCalledWith(dto);
    });

    it('sets the token as an httpOnly cookie and returns only the user', async () => {
      authService.registration.mockResolvedValue({
        token: 'signed-token',
        user,
      });

      const result = await controller.registration(
        dto,
        res as unknown as Response,
      );

      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'signed-token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result).toEqual({ user });
    });
  });

  describe('logout()', () => {
    it('logs out the user from req.user and clears the token cookie', async () => {
      const req = { user: { email: 'a@test.com' } } as unknown as Request;

      await controller.logout(req, res as unknown as Response);

      expect(authService.logout).toHaveBeenCalledWith('a@test.com');
      expect(res.clearCookie).toHaveBeenCalledWith(
        'token',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('still clears the cookie when req.user is missing', async () => {
      const req = {} as unknown as Request;

      await controller.logout(req, res as unknown as Response);

      expect(authService.logout).not.toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });

  describe('me()', () => {
    it('returns the current user resolved from req.user.email', async () => {
      const user = { email: 'a@test.com', name: 'A', isActivated: true };
      authService.getCurrentUser.mockResolvedValue(user);
      const req = { user: { email: 'a@test.com' } } as unknown as Request;

      const result = await controller.me(req);

      expect(authService.getCurrentUser).toHaveBeenCalledWith('a@test.com');
      expect(result).toEqual({ user });
    });

    it('throws UnauthorizedException when req.user is missing', async () => {
      const req = {} as unknown as Request;

      await expect(controller.me(req)).rejects.toThrow(UnauthorizedException);
      expect(authService.getCurrentUser).not.toHaveBeenCalled();
    });
  });
});
