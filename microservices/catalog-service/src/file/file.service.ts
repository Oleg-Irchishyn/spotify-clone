import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as uuid from 'uuid';

import { FileType } from '../common/file-type.enum';

// The file arrives over a TCP message (JSON), not as a multipart stream —
// api-gateway base64-encodes the buffer it received from multer before
// forwarding it here. This sandbox only demonstrates local-disk storage; the
// monolith's Cloudflare R2 branch (server/src/file/file.service.ts) is
// intentionally left out to keep the split focused.
export interface UploadedFilePayload {
  originalname: string;
  base64: string;
}

@Injectable()
export class FileService {
  createFile(type: FileType, file: UploadedFilePayload): string {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid.v4()}.${fileExtension}`;
    const key = `${type}/${fileName}`;

    const dirPath = path.resolve(process.cwd(), 'static', type);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(
      path.resolve(dirPath, fileName),
      Buffer.from(file.base64, 'base64'),
    );

    // Returned as an absolute URL (unlike the monolith's dev mode, which
    // returns a bare relative path and lets the client prefix it) since
    // nothing outside this service knows its PUBLIC_URL.
    return `${this.publicUrl()}/${key}`;
  }

  removeFile(fileUrl: string): void {
    const base = this.publicUrl();
    const relative = fileUrl.startsWith(base)
      ? fileUrl.slice(base.length + 1)
      : fileUrl;

    const fullPath = path.resolve(process.cwd(), 'static', relative);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  private publicUrl(): string {
    return process.env.PUBLIC_URL ?? 'http://localhost:4002';
  }
}
