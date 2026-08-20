import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Users } from '../schemas/user.schema';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersModel: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    updateOne: jest.Mock;
  };

  beforeEach(async () => {
    usersModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(Users.name), useValue: usersModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('createUser() creates a user with the given dto', async () => {
    const dto = { email: 'a@test.com', name: 'A', password: 'hashed' };
    usersModel.create.mockResolvedValue({ _id: 'id1', ...dto });

    const result = await service.createUser(dto);

    expect(usersModel.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ _id: 'id1', ...dto });
  });

  it('getAllUsers() returns all users', async () => {
    const exec = jest.fn().mockResolvedValue([{ email: 'a@test.com' }]);
    usersModel.find.mockReturnValue({ exec });

    const result = await service.getAllUsers();

    expect(usersModel.find).toHaveBeenCalledWith();
    expect(result).toEqual([{ email: 'a@test.com' }]);
  });

  it('getUserByEmail() finds a user by email', async () => {
    const exec = jest.fn().mockResolvedValue({ email: 'a@test.com' });
    usersModel.findOne.mockReturnValue({ exec });

    const result = await service.getUserByEmail('a@test.com');

    expect(usersModel.findOne).toHaveBeenCalledWith({ email: 'a@test.com' });
    expect(result).toEqual({ email: 'a@test.com' });
  });

  it('getUserByEmail() returns null when no user is found', async () => {
    const exec = jest.fn().mockResolvedValue(null);
    usersModel.findOne.mockReturnValue({ exec });

    const result = await service.getUserByEmail('missing@test.com');

    expect(result).toBeNull();
  });

  it('setActivated() updates the isActivated flag by email', async () => {
    const exec = jest.fn().mockResolvedValue({ acknowledged: true });
    usersModel.updateOne.mockReturnValue({ exec });

    await service.setActivated('a@test.com', true);

    expect(usersModel.updateOne).toHaveBeenCalledWith(
      { email: 'a@test.com' },
      { isActivated: true },
    );
  });

  it('setActivated() can also deactivate a user', async () => {
    const exec = jest.fn().mockResolvedValue({ acknowledged: true });
    usersModel.updateOne.mockReturnValue({ exec });

    await service.setActivated('a@test.com', false);

    expect(usersModel.updateOne).toHaveBeenCalledWith(
      { email: 'a@test.com' },
      { isActivated: false },
    );
  });
});
