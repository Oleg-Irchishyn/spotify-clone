import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from 'src/users/users.service';

import { AlbumController } from '../album.controller';
import { AlbumService } from '../album.service';

describe('AlbumController', () => {
  let controller: AlbumController;
  let albumService: {
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    getAll: jest.Mock;
    getOne: jest.Mock;
  };

  const mockFile = {
    originalname: 'a.jpg',
    buffer: Buffer.from('x'),
  } as Express.Multer.File;
  const dto = { name: 'A', author: 'B' };

  beforeEach(async () => {
    albumService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
      getOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [
        { provide: AlbumService, useValue: albumService },
        { provide: JwtService, useValue: { verify: jest.fn() } },
        { provide: UsersService, useValue: { setActivated: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AlbumController>(AlbumController);
  });

  it('create() throws BadRequestException when picture is missing', () => {
    expect(() => controller.create({}, dto)).toThrow(BadRequestException);
  });

  it('create() delegates to albumService.create with the extracted picture', () => {
    void controller.create({ picture: [mockFile] }, dto);

    expect(albumService.create).toHaveBeenCalledWith(dto, mockFile);
  });

  it('update() does not throw and delegates even when no picture is provided', () => {
    expect(() => controller.update('id1', {}, dto)).not.toThrow();
    expect(albumService.update).toHaveBeenCalledWith('id1', dto, undefined);
  });

  it('delete() delegates to albumService.delete with the given id', () => {
    void controller.delete('id1');

    expect(albumService.delete).toHaveBeenCalledWith('id1');
  });

  it('getAll() delegates to albumService.getAll with query, count and offset in order', () => {
    void controller.getAll(5, 10, 'search term');

    expect(albumService.getAll).toHaveBeenCalledWith('search term', 5, 10);
  });

  it('getOne() delegates to albumService.getOne with the given id', () => {
    void controller.getOne('id1');

    expect(albumService.getOne).toHaveBeenCalledWith('id1');
  });
});
