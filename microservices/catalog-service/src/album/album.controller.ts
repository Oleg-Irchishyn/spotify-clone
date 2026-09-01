import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import type { UploadedFilePayload } from '../file/file.service';
import { AlbumService } from './album.service';
import type { CreateAlbumDto } from './dto/create-album.dto';

interface CreateAlbumMessage {
  dto: CreateAlbumDto;
  picture: UploadedFilePayload;
}

interface UpdateAlbumMessage {
  id: string;
  dto: CreateAlbumDto;
  picture?: UploadedFilePayload;
}

interface GetAllAlbumsMessage {
  query?: string;
  count?: number;
  offset?: number;
}

@Controller()
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @MessagePattern('album.create')
  create(@Payload() { dto, picture }: CreateAlbumMessage) {
    return this.albumService.create(dto, picture);
  }

  @MessagePattern('album.update')
  update(@Payload() { id, dto, picture }: UpdateAlbumMessage) {
    return this.albumService.update(id, dto, picture);
  }

  @MessagePattern('album.getAll')
  getAll(@Payload() { query, count, offset }: GetAllAlbumsMessage) {
    return this.albumService.getAll(query ?? '', count, offset);
  }

  @MessagePattern('album.getOne')
  getOne(@Payload() { id }: { id: string }) {
    return this.albumService.getOne(id);
  }

  @MessagePattern('album.delete')
  delete(@Payload() { id }: { id: string }) {
    return this.albumService.delete(id);
  }

  @MessagePattern('album.count')
  async count() {
    return { count: await this.albumService.count() };
  }
}
