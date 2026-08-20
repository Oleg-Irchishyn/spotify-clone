import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: { createUser: jest.Mock; getAllUsers: jest.Mock };

  const dto = { email: 'a@test.com', name: 'A', password: '12345' };

  beforeEach(async () => {
    usersService = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('create() delegates to usersService.createUser with the dto', () => {
    void controller.create(dto);

    expect(usersService.createUser).toHaveBeenCalledWith(dto);
  });

  it('getAll() delegates to usersService.getAllUsers', () => {
    void controller.getAll();

    expect(usersService.getAllUsers).toHaveBeenCalled();
  });
});
