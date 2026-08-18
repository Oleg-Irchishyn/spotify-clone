import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { FileType } from 'src/common/enums/file-type.enum';
import { FileService } from 'src/file/file.service';
import { Track } from 'src/track/schemas/track.schema';

import { AlbumService } from './album.service';
import { Album } from './schemas/album.schema';

describe('AlbumService', () => {
  let service: AlbumService;
  let albumModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    countDocuments: jest.Mock;
  };
  let trackModel: { updateMany: jest.Mock };
  let fileService: { createFile: jest.Mock; removeFile: jest.Mock };

  const mockPicture = {
    originalname: 'a.jpg',
    buffer: Buffer.from('x'),
  } as Express.Multer.File;

  beforeEach(async () => {
    albumModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(0),
    };
    trackModel = { updateMany: jest.fn().mockResolvedValue(undefined) };
    fileService = { createFile: jest.fn(), removeFile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumService,
        { provide: getModelToken(Album.name), useValue: albumModel },
        { provide: getModelToken(Track.name), useValue: trackModel },
        { provide: FileService, useValue: fileService },
      ],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
  });

  it('create() saves the picture and creates an album with the returned path', async () => {
    fileService.createFile.mockReturnValue('image/1.jpg');
    albumModel.create.mockResolvedValue({ name: 'A' });

    await service.create({ name: 'A', author: 'B' }, mockPicture);

    expect(fileService.createFile).toHaveBeenCalledWith(
      FileType.IMAGE,
      mockPicture,
    );
    expect(albumModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ picture: 'image/1.jpg' }),
    );
  });

  it('update() throws NotFoundException when the album does not exist', async () => {
    albumModel.findById.mockResolvedValue(null);

    await expect(
      service.update('missing-id', { name: 'A', author: 'B' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update() does not touch files when no new picture is provided', async () => {
    albumModel.findById.mockResolvedValue({ picture: 'image/old.jpg' });
    albumModel.findByIdAndUpdate.mockResolvedValue({
      picture: 'image/old.jpg',
    });

    await service.update('id1', { name: 'A', author: 'B' });

    expect(fileService.createFile).not.toHaveBeenCalled();
    expect(fileService.removeFile).not.toHaveBeenCalled();
  });

  it('update() replaces and removes the old picture when a new one is provided', async () => {
    albumModel.findById.mockResolvedValue({ picture: 'image/old.jpg' });
    fileService.createFile.mockReturnValue('image/new.jpg');
    albumModel.findByIdAndUpdate.mockResolvedValue({
      picture: 'image/new.jpg',
    });

    await service.update('id1', { name: 'A', author: 'B' }, mockPicture);

    expect(fileService.removeFile).toHaveBeenCalledWith('image/old.jpg');
    expect(albumModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'id1',
      expect.objectContaining({ picture: 'image/new.jpg' }),
      { new: true },
    );
  });

  it('delete() throws NotFoundException when the album does not exist', async () => {
    albumModel.findByIdAndDelete.mockResolvedValue(null);

    await expect(service.delete('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('delete() removes the picture and returns the id when the album exists', async () => {
    albumModel.findByIdAndDelete.mockResolvedValue({
      _id: 'id1',
      picture: 'image/1.jpg',
    });

    const result = await service.delete('id1');

    expect(fileService.removeFile).toHaveBeenCalledWith('image/1.jpg');
    expect(result).toBe('id1');
  });

  it('delete() unlinks tracks that referenced the deleted album', async () => {
    albumModel.findByIdAndDelete.mockResolvedValue({
      _id: 'id1',
      picture: '',
    });

    await service.delete('id1');

    expect(trackModel.updateMany).toHaveBeenCalledWith(
      { album: 'id1' },
      { $unset: { album: 1 } },
    );
  });

  it('update() throws NotFoundException when the album disappears between the existence check and the update', async () => {
    albumModel.findById.mockResolvedValue({ picture: 'image/old.jpg' });
    albumModel.findByIdAndUpdate.mockResolvedValue(null);

    await expect(
      service.update('id1', { name: 'A', author: 'B' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('getAll() escapes the query and searches name/author with skip/limit, returning the total count', async () => {
    const queryMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: (resolve: (value: unknown) => void) => resolve([{ name: 'A' }]),
    };
    albumModel.find.mockReturnValue(queryMock);
    albumModel.countDocuments.mockResolvedValue(1);

    const result = await service.getAll('a.b', 5, 10);

    expect(albumModel.find).toHaveBeenCalledWith({
      $or: [
        { name: expect.any(RegExp) as RegExp },
        { author: expect.any(RegExp) as RegExp },
      ],
    });
    expect(queryMock.skip).toHaveBeenCalledWith(10);
    expect(queryMock.limit).toHaveBeenCalledWith(5);
    expect(result).toEqual({ albums: [{ name: 'A' }], totalCount: 1 });
  });

  it('getOne() finds the album by id', async () => {
    albumModel.findById.mockResolvedValue({ name: 'A' });

    const result = await service.getOne('id1');

    expect(albumModel.findById).toHaveBeenCalledWith('id1');
    expect(result).toEqual({ name: 'A' });
  });

  it('getAll() falls back to the default count and offset when not provided', async () => {
    const queryMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: (resolve: (value: unknown) => void) => resolve([]),
    };
    albumModel.find.mockReturnValue(queryMock);

    await service.getAll('a.b');

    expect(queryMock.skip).toHaveBeenCalledWith(0);
    expect(queryMock.limit).toHaveBeenCalledWith(10);
  });

  it('delete() does not call removeFile when the album has no picture', async () => {
    albumModel.findByIdAndDelete.mockResolvedValue({ _id: 'id1', picture: '' });

    await service.delete('id1');

    expect(fileService.removeFile).not.toHaveBeenCalled();
  });
});
