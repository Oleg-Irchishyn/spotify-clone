import { HttpException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as uuid from 'uuid';
import { FileService } from './file.service';
import { FileType } from 'src/common/enums/file-type.enum';

jest.mock('node:fs');
jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('FileService', () => {
  let service: FileService;
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const mockedUuid = uuid as jest.Mocked<typeof uuid>;

  const mockFile = {
    originalname: 'photo.jpg',
    buffer: Buffer.from('data'),
  } as Express.Multer.File;

  beforeEach(() => {
    service = new FileService();
    jest.clearAllMocks();
    (mockedUuid.v4 as jest.Mock).mockReturnValue('fixed-uuid');
  });

  it('createFile() writes the buffer and returns "type/uuid.ext"', () => {
    mockedFs.existsSync.mockReturnValue(true);

    const result = service.createFile(FileType.IMAGE, mockFile);

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('fixed-uuid.jpg'),
      mockFile.buffer,
    );
    expect(result).toBe('image/fixed-uuid.jpg');
  });

  it('createFile() creates the target directory when it does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false);

    service.createFile(FileType.AUDIO, mockFile);

    expect(mockedFs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
      recursive: true,
    });
  });

  it('createFile() wraps filesystem errors into an HttpException', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.writeFileSync.mockImplementation(() => {
      throw new Error('disk is full');
    });

    expect(() => service.createFile(FileType.IMAGE, mockFile)).toThrow(
      HttpException,
    );
  });

  it('createFile() falls back to a generic message when the thrown value is not an Error', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.writeFileSync.mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- deliberately simulating a non-Error throw
      throw 'not an Error instance';
    });

    try {
      service.createFile(FileType.IMAGE, mockFile);
      fail('expected createFile to throw');
    } catch (error) {
      expect((error as HttpException).message).toBe('Internal server error');
    }
  });

  it('removeFile() deletes the file when it exists', () => {
    mockedFs.existsSync.mockReturnValue(true);

    service.removeFile('image/existing.jpg');

    expect(mockedFs.unlinkSync).toHaveBeenCalledWith(
      expect.stringContaining('existing.jpg'),
    );
  });

  it('removeFile() does nothing when the file does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false);

    service.removeFile('image/missing.jpg');

    expect(mockedFs.unlinkSync).not.toHaveBeenCalled();
  });

  it('removeFile() wraps filesystem errors into an HttpException', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.unlinkSync.mockImplementation(() => {
      throw new Error('permission denied');
    });

    expect(() => service.removeFile('image/existing.jpg')).toThrow(
      HttpException,
    );
  });

  it('falls back to a generic message when the thrown value is not an Error', () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.unlinkSync.mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- deliberately simulating a non-Error throw
      throw 'not an Error instance';
    });

    try {
      service.removeFile('image/existing.jpg');
      fail('expected removeFile to throw');
    } catch (error) {
      expect((error as HttpException).message).toBe('Internal server error');
    }
  });
});
