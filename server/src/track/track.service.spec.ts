import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { FileType } from 'src/common/enums/file-type.enum';
import { FileService } from 'src/file/file.service';

import { Comment } from './schemas/comment.schema';
import { Track } from './schemas/track.schema';
import { TrackService } from './track.service';

const createQueryMock = (resolvedValue: unknown) => ({
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  then: (resolve: (value: unknown) => void) => resolve(resolvedValue),
});

describe('TrackService', () => {
  let service: TrackService;
  let trackModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    countDocuments: jest.Mock;
  };
  let commentModel: { create: jest.Mock };
  let fileService: { createFile: jest.Mock; removeFile: jest.Mock };

  const mockFile = {
    originalname: 'a.jpg',
    buffer: Buffer.from('x'),
  } as Express.Multer.File;

  beforeEach(async () => {
    trackModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(0),
    };
    commentModel = { create: jest.fn() };
    fileService = { createFile: jest.fn(), removeFile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        { provide: getModelToken(Track.name), useValue: trackModel },
        { provide: getModelToken(Comment.name), useValue: commentModel },
        { provide: FileService, useValue: fileService },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('create() saves both files and creates a track with listens: 0', async () => {
    fileService.createFile
      .mockReturnValueOnce('audio/1.mp3')
      .mockReturnValueOnce('image/1.jpg');
    trackModel.create.mockResolvedValue({ name: 'Test' });

    await service.create(
      { name: 'Test', artist: 'A', text: 'T' },
      mockFile,
      mockFile,
    );

    expect(fileService.createFile).toHaveBeenCalledWith(
      FileType.AUDIO,
      mockFile,
    );
    expect(fileService.createFile).toHaveBeenCalledWith(
      FileType.IMAGE,
      mockFile,
    );
    expect(trackModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        listens: 0,
        audio: 'audio/1.mp3',
        picture: 'image/1.jpg',
      }),
    );
  });

  it('delete() returns null and does not touch files when track is not found', async () => {
    trackModel.findByIdAndDelete.mockResolvedValue(null);

    const result = await service.delete('missing-id');

    expect(result).toBeNull();
    expect(fileService.removeFile).not.toHaveBeenCalled();
  });

  it('delete() removes both picture and audio files when track is found', async () => {
    trackModel.findByIdAndDelete.mockResolvedValue({
      _id: 'id1',
      picture: 'image/1.jpg',
      audio: 'audio/1.mp3',
    });

    const result = await service.delete('id1');

    expect(fileService.removeFile).toHaveBeenCalledWith('image/1.jpg');
    expect(fileService.removeFile).toHaveBeenCalledWith('audio/1.mp3');
    expect(result).toBe('id1');
  });

  it('delete() does not call removeFile when the track has no picture/audio', async () => {
    trackModel.findByIdAndDelete.mockResolvedValue({
      _id: 'id1',
      picture: '',
      audio: '',
    });

    await service.delete('id1');

    expect(fileService.removeFile).not.toHaveBeenCalled();
  });

  it('update() throws NotFoundException when the track does not exist', async () => {
    trackModel.findById.mockResolvedValue(null);

    await expect(
      service.update('missing-id', { name: 'N', artist: 'A', text: 'T' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('update() replaces and removes old picture/audio when new files are provided', async () => {
    trackModel.findById.mockResolvedValue({
      picture: 'image/old.jpg',
      audio: 'audio/old.mp3',
    });
    fileService.createFile
      .mockReturnValueOnce('image/new.jpg')
      .mockReturnValueOnce('audio/new.mp3');
    trackModel.findByIdAndUpdate.mockResolvedValue({ name: 'Updated' });

    const result = await service.update(
      'id1',
      { name: 'N', artist: 'A', text: 'T' },
      mockFile,
      mockFile,
    );

    expect(fileService.removeFile).toHaveBeenCalledWith('image/old.jpg');
    expect(fileService.removeFile).toHaveBeenCalledWith('audio/old.mp3');
    expect(trackModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'id1',
      expect.objectContaining({
        picture: 'image/new.jpg',
        audio: 'audio/new.mp3',
      }),
      { new: true },
    );
    expect(result).toEqual({ name: 'Updated' });
  });

  it('update() does not touch any files when no new picture/audio is provided', async () => {
    trackModel.findById.mockResolvedValue({
      picture: 'image/old.jpg',
      audio: 'audio/old.mp3',
    });
    trackModel.findByIdAndUpdate.mockResolvedValue({ name: 'Updated' });

    await service.update('id1', { name: 'N', artist: 'A', text: 'T' });

    expect(fileService.createFile).not.toHaveBeenCalled();
    expect(fileService.removeFile).not.toHaveBeenCalled();
  });

  it('update() throws NotFoundException when the track disappears before the update is applied', async () => {
    trackModel.findById.mockResolvedValue({ picture: '', audio: '' });
    trackModel.findByIdAndUpdate.mockResolvedValue(null);

    await expect(
      service.update('id1', { name: 'N', artist: 'A', text: 'T' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('getAll() paginates tracks using skip/limit and returns the total count', async () => {
    trackModel.find.mockReturnValue(createQueryMock([{ name: 'A' }]));
    trackModel.countDocuments.mockResolvedValue(1);

    const result = await service.getAll(5, 10);

    expect(trackModel.find).toHaveBeenCalled();
    expect(result).toEqual({ tracks: [{ name: 'A' }], totalCount: 1 });
  });

  it('getAll() falls back to the default count and offset when not provided', async () => {
    const queryMock = createQueryMock([]);
    trackModel.find.mockReturnValue(queryMock);

    await service.getAll();

    expect(queryMock.skip).toHaveBeenCalledWith(0);
    expect(queryMock.limit).toHaveBeenCalledWith(10);
  });

  it('getOne() finds the track by id and populates its comments', async () => {
    trackModel.findById.mockReturnValue(createQueryMock({ name: 'A' }));

    const result = await service.getOne('id1');

    expect(result).toEqual({ name: 'A' });
  });

  it('addComment() creates a comment, links it to the track and saves it', async () => {
    const track = { comments: [] as unknown[], save: jest.fn() };
    trackModel.findById.mockResolvedValue(track);
    commentModel.create.mockResolvedValue({ _id: 'comment1' });

    const dto = { username: 'u', text: 't', trackId: 'id1' };
    const result = await service.addComment(dto);

    expect(commentModel.create).toHaveBeenCalledWith(dto);
    expect(track.comments).toEqual(['comment1']);
    expect(track.save).toHaveBeenCalled();
    expect(result).toEqual({ _id: 'comment1' });
  });

  it('listen() increments the listens counter and saves the track when found', async () => {
    const track = { listens: 4, save: jest.fn() };
    trackModel.findById.mockResolvedValue(track);

    await service.listen('id1');

    expect(track.listens).toBe(5);
    expect(track.save).toHaveBeenCalled();
  });

  it('listen() does nothing when the track is not found', async () => {
    trackModel.findById.mockResolvedValue(null);

    await expect(service.listen('missing-id')).resolves.toBeUndefined();
  });

  it('search() escapes regex special characters, searches name/artist/text, and paginates results', async () => {
    let capturedFilter: unknown;
    trackModel.find.mockImplementation((filter: unknown) => {
      capturedFilter = filter;
      return createQueryMock([]);
    });
    trackModel.countDocuments.mockResolvedValue(0);

    const result = await service.search('a.b*', 5, 10);

    expect(trackModel.find).toHaveBeenCalledWith({
      $or: [
        { name: expect.any(RegExp) as RegExp },
        { artist: expect.any(RegExp) as RegExp },
        { text: expect.any(RegExp) as RegExp },
      ],
    });
    expect(trackModel.countDocuments).toHaveBeenCalledWith(capturedFilter);
    const { $or } = capturedFilter as { $or: { name: RegExp }[] };
    expect($or[0].name.source).toBe('a\\.b\\*');
    expect(result).toEqual({ tracks: [], totalCount: 0 });
  });
});
