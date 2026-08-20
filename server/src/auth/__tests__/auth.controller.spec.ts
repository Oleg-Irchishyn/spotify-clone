import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock; registration: jest.Mock };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      registration: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login() delegates to authService.login with the dto', () => {
    const dto = { email: 'a@test.com', password: '12345' };

    void controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('registration() delegates to authService.registration with the dto', () => {
    const dto = { email: 'a@test.com', name: 'A', password: '12345' };

    void controller.registration(dto);

    expect(authService.registration).toHaveBeenCalledWith(dto);
  });
});
