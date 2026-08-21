import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as uuid from 'uuid';

import { FileType } from 'src/common/enums/file-type.enum';

@Injectable()
export class FileService {
  private readonly s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  });

  private isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const key = type + '/' + fileName;

      if (this.isProduction()) {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        return `${process.env.R2_PUBLIC_URL}/${key}`;
      }

      const filePath = path.resolve(process.cwd(), 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return key;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFile(filePath: string): Promise<void> {
    try {
      if (this.isProduction()) {
        // Pre-migration records may still hold a local "type/name" path
        // rather than a full R2 URL — nothing to delete for those.
        if (!/^https?:\/\//.test(filePath)) {
          return;
        }

        const key = new URL(filePath).pathname.replace(/^\//, '');
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
          }),
        );
        return;
      }

      const fullPath = path.resolve(process.cwd(), 'static', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
