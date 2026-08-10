import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

describe('TrackController', () => {
  let controller: TrackController;
  let trackService: {
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    getAll: jest.Mock;
    search: jest.Mock;
    getOne: jest.Mock;
    addComment: jest.Mock;
    listen: jest.Mock;
  };

  const mockFile = {
    originalname: 'a.jpg',
    buffer: Buffer.from('x'),
  } as Express.Multer.File;
  const dto = { name: 'Test', artist: 'A', text: 'T' };

  beforeEach(async () => {
    trackService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
      search: jest.fn(),
      getOne: jest.fn(),
      addComment: jest.fn(),
      listen: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [{ provide: TrackService, useValue: trackService }],
    }).compile();

    controller = module.get<TrackController>(TrackController);
  });

  it('create() throws BadRequestException when picture is missing', () => {
    expect(() => controller.create({ audio: [mockFile] }, dto)).toThrow(
      BadRequestException,
    );
  });

  it('create() throws BadRequestException when audio is missing', () => {
    expect(() => controller.create({ picture: [mockFile] }, dto)).toThrow(
      BadRequestException,
    );
  });

  it('create() delegates to trackService.create with the extracted files', () => {
    void controller.create({ picture: [mockFile], audio: [mockFile] }, dto);

    expect(trackService.create).toHaveBeenCalledWith(dto, mockFile, mockFile);
  });

  it('update() does not throw and delegates even when no files are provided', () => {
    expect(() => controller.update('id1', {}, dto)).not.toThrow();
    expect(trackService.update).toHaveBeenCalledWith(
      'id1',
      dto,
      undefined,
      undefined,
    );
  });

  it('delete() delegates to trackService.delete with the given id', () => {
    void controller.delete('id1');

    expect(trackService.delete).toHaveBeenCalledWith('id1');
  });

  it('getAll() delegates to trackService.getAll with count and offset', () => {
    void controller.getAll(5, 10);

    expect(trackService.getAll).toHaveBeenCalledWith(5, 10);
  });

  it('search() delegates to trackService.search with the query', () => {
    void controller.search('bohemian');

    expect(trackService.search).toHaveBeenCalledWith('bohemian');
  });

  it('getOne() delegates to trackService.getOne with the given id', () => {
    void controller.getOne('id1');

    expect(trackService.getOne).toHaveBeenCalledWith('id1');
  });

  it('addComment() delegates to trackService.addComment with the dto', () => {
    const commentDto = { username: 'u', text: 't', trackId: 'id1' };
    void controller.addComment(commentDto);

    expect(trackService.addComment).toHaveBeenCalledWith(commentDto);
  });

  it('listen() delegates to trackService.listen with the given id', () => {
    void controller.listen('id1');

    expect(trackService.listen).toHaveBeenCalledWith('id1');
  });
});
