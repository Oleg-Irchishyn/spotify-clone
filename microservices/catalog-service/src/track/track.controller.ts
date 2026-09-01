import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import type { UploadedFilePayload } from '../file/file.service';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';

interface CreateTrackMessage {
  dto: CreateTrackDto;
  picture: UploadedFilePayload;
  audio: UploadedFilePayload;
}

interface UpdateTrackMessage {
  id: string;
  dto: CreateTrackDto;
  picture?: UploadedFilePayload;
  audio?: UploadedFilePayload;
}

interface GetAllTracksMessage {
  count?: number;
  offset?: number;
  albumId?: string;
}

interface SearchTracksMessage extends GetAllTracksMessage {
  query: string;
}

@Controller()
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @MessagePattern('tracks.create')
  create(@Payload() { dto, picture, audio }: CreateTrackMessage) {
    return this.trackService.create(dto, picture, audio);
  }

  @MessagePattern('tracks.update')
  update(@Payload() { id, dto, picture, audio }: UpdateTrackMessage) {
    return this.trackService.update(id, dto, picture, audio);
  }

  @MessagePattern('tracks.getAll')
  getAll(@Payload() { count, offset, albumId }: GetAllTracksMessage) {
    return this.trackService.getAll(count, offset, albumId);
  }

  @MessagePattern('tracks.search')
  search(@Payload() { query, count, offset, albumId }: SearchTracksMessage) {
    return this.trackService.search(query, count, offset, albumId);
  }

  @MessagePattern('tracks.getOne')
  getOne(@Payload() { id }: { id: string }) {
    return this.trackService.getOne(id);
  }

  @MessagePattern('tracks.delete')
  delete(@Payload() { id }: { id: string }) {
    return this.trackService.delete(id);
  }

  @MessagePattern('tracks.addComment')
  addComment(@Payload() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @MessagePattern('tracks.listen')
  listen(@Payload() { id }: { id: string }) {
    return this.trackService.listen(id);
  }

  @MessagePattern('tracks.count')
  async count() {
    return { count: await this.trackService.count() };
  }
}
