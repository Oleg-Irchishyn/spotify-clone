import { HttpException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';

import { UsersService } from 'src/users/users.service';

import { AuthService } from '../auth.service';

jest.mock('bcryptjs', () => ({ hash: jest.fn(), compare: jest.fn() }));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    getUserByEmail: jest.Mock;
    createUser: jest.Mock;
    setActivated: jest.Mock;
  };
  let jwtService: { sign: jest.Mock };
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    jest.clearAllMocks();
    usersService = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      setActivated: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('signed-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login()', () => {
    it('throws UnauthorizedException when no user exists with the given email', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'missing@test.com', password: '12345' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      usersService.getUserByEmail.mockResolvedValue({
        email: 'a@test.com',
        password: 'hashed',
      });
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        service.login({ email: 'a@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('activates the user and returns a signed token on valid credentials', async () => {
      usersService.getUserByEmail.mockResolvedValue({
        _id: 'id1',
        email: 'a@test.com',
        name: 'A',
        password: 'hashed',
      });
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.login({
        email: 'a@test.com',
        password: '12345',
      });

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('12345', 'hashed');
      expect(usersService.setActivated).toHaveBeenCalledWith(
        'a@test.com',
        true,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: 'id1',
        email: 'a@test.com',
        name: 'A',
        isActivated: true,
      });
      expect(result).toEqual({ token: 'signed-token' });
    });
  });

  describe('registration()', () => {
    it('throws a 400 HttpException when a user with the given email already exists', async () => {
      usersService.getUserByEmail.mockResolvedValue({ email: 'a@test.com' });

      await expect(
        service.registration({
          email: 'a@test.com',
          name: 'A',
          password: '12345',
        }),
      ).rejects.toThrow(HttpException);
      expect(usersService.createUser).not.toHaveBeenCalled();
    });

    it('hashes the password, creates the user, and returns a signed token', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
      usersService.createUser.mockResolvedValue({
        _id: 'id1',
        email: 'a@test.com',
        name: 'A',
        password: 'hashed-password',
      });

      const result = await service.registration({
        email: 'a@test.com',
        name: 'A',
        password: '12345',
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('12345', 5);
      expect(usersService.createUser).toHaveBeenCalledWith({
        email: 'a@test.com',
        name: 'A',
        password: 'hashed-password',
      });
      expect(usersService.setActivated).toHaveBeenCalledWith(
        'a@test.com',
        true,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: 'id1',
        email: 'a@test.com',
        name: 'A',
        isActivated: true,
      });
      expect(result).toEqual({ token: 'signed-token' });
    });
  });
});
