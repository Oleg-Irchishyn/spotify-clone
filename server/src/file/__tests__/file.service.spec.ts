import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as uuid from 'uuid';

import { FileType } from 'src/common/enums/file-type.enum';

import { FileService } from '../file.service';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: jest
    .fn()
    .mockImplementation((input: unknown) => ({ input })),
  DeleteObjectCommand: jest
    .fn()
    .mockImplementation((input: unknown) => ({ input })),
}));
jest.mock('node:fs');
jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('FileService', () => {
  let service: FileService;
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const mockedUuid = uuid as jest.Mocked<typeof uuid>;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalEnv = { ...process.env };

  const mockFile = {
    originalname: 'photo.jpg',
    buffer: Buffer.from('data'),
    mimetype: 'image/jpeg',
  } as Express.Multer.File;

  beforeEach(() => {
    service = new FileService();
    jest.clearAllMocks();
    (mockedUuid.v4 as jest.Mock).mockReturnValue('fixed-uuid');
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    });
  });

  describe('in development (local disk)', () => {
    it('createFile() writes the buffer and returns "type/uuid.ext"', async () => {
      mockedFs.existsSync.mockReturnValue(true);

      const result = await service.createFile(FileType.IMAGE, mockFile);

      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('fixed-uuid.jpg'),
        mockFile.buffer,
      );
      expect(result).toBe('image/fixed-uuid.jpg');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('createFile() creates the target directory when it does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await service.createFile(FileType.AUDIO, mockFile);

      expect(mockedFs.mkdirSync).toHaveBeenCalledWith(expect.any(String), {
        recursive: true,
      });
    });

    it('createFile() wraps filesystem errors into an HttpException', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.writeFileSync.mockImplementation(() => {
        throw new Error('disk is full');
      });

      await expect(
        service.createFile(FileType.IMAGE, mockFile),
      ).rejects.toThrow(HttpException);
    });

    it('createFile() falls back to a generic message when the thrown value is not an Error', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.writeFileSync.mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- deliberately simulating a non-Error throw
        throw 'not an Error instance';
      });

      try {
        await service.createFile(FileType.IMAGE, mockFile);
        fail('expected createFile to throw');
      } catch (error) {
        expect((error as HttpException).message).toBe('Internal server error');
      }
    });

    it('removeFile() deletes the file when it exists', async () => {
      mockedFs.existsSync.mockReturnValue(true);

      await service.removeFile('image/existing.jpg');

      expect(mockedFs.unlinkSync).toHaveBeenCalledWith(
        expect.stringContaining('existing.jpg'),
      );
    });

    it('removeFile() does nothing when the file does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await service.removeFile('image/missing.jpg');

      expect(mockedFs.unlinkSync).not.toHaveBeenCalled();
    });

    it('removeFile() wraps filesystem errors into an HttpException', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.unlinkSync.mockImplementation(() => {
        throw new Error('permission denied');
      });

      await expect(service.removeFile('image/existing.jpg')).rejects.toThrow(
        HttpException,
      );
    });

    it('removeFile() falls back to a generic message when the thrown value is not an Error', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.unlinkSync.mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- deliberately simulating a non-Error throw
        throw 'not an Error instance';
      });

      try {
        await service.removeFile('image/existing.jpg');
        fail('expected removeFile to throw');
      } catch (error) {
        expect((error as HttpException).message).toBe('Internal server error');
      }
    });
  });

  describe('in production (Cloudflare R2)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.R2_ACCOUNT_ID = 'account-id';
      process.env.R2_ACCESS_KEY_ID = 'access-key';
      process.env.R2_SECRET_ACCESS_KEY = 'secret-key';
      process.env.R2_BUCKET_NAME = 'spotify-clone-uploads';
      process.env.R2_PUBLIC_URL = 'https://pub-xxxx.r2.dev';
      service = new FileService();
    });

    it('createFile() uploads to R2 and returns the public URL', async () => {
      mockSend.mockResolvedValue({});

      const result = await service.createFile(FileType.IMAGE, mockFile);

      expect(PutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: 'spotify-clone-uploads',
          Key: 'image/fixed-uuid.jpg',
          Body: mockFile.buffer,
          ContentType: 'image/jpeg',
        }),
      );
      expect(mockSend).toHaveBeenCalled();
      expect(result).toBe('https://pub-xxxx.r2.dev/image/fixed-uuid.jpg');
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('createFile() wraps S3 errors into an HttpException', async () => {
      mockSend.mockRejectedValue(new Error('bucket unreachable'));

      await expect(
        service.createFile(FileType.IMAGE, mockFile),
      ).rejects.toThrow(HttpException);
    });

    it('removeFile() deletes the object by key extracted from the public URL', async () => {
      mockSend.mockResolvedValue({});

      await service.removeFile('https://pub-xxxx.r2.dev/image/old.jpg');

      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: 'spotify-clone-uploads',
        Key: 'image/old.jpg',
      });
      expect(mockSend).toHaveBeenCalled();
    });

    it('removeFile() no-ops for pre-migration local paths', async () => {
      await service.removeFile('image/old.jpg');

      expect(mockSend).not.toHaveBeenCalled();
    });

    it('removeFile() wraps S3 errors into an HttpException', async () => {
      mockSend.mockRejectedValue(new Error('access denied'));

      await expect(
        service.removeFile('https://pub-xxxx.r2.dev/image/old.jpg'),
      ).rejects.toThrow(HttpException);
    });
  });
});
