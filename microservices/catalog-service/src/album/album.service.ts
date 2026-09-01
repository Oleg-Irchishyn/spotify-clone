import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { Model, Types } from 'mongoose';

import { escapeRegExp } from '../common/regex.util';
import { FileType } from '../common/file-type.enum';
import { FileService, UploadedFilePayload } from '../file/file.service';
import { Track, TrackDocument } from '../track/schemas/track.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private readonly trackModel: Model<TrackDocument>,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateAlbumDto,
    picture: UploadedFilePayload,
  ): Promise<Album> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    return this.albumModel.create({ ...dto, picture: picturePath });
  }

  async update(
    id: string,
    dto: CreateAlbumDto,
    picture?: UploadedFilePayload,
  ): Promise<Album> {
    const existingAlbum = await this.albumModel.findById(id, 'picture');
    if (!existingAlbum) {
      throw new RpcException(`Album with id ${id} not found`);
    }

    const update: Partial<Album> = { ...dto };
    if (picture) {
      update.picture = this.fileService.createFile(FileType.IMAGE, picture);
    }

    const updatedAlbum = await this.albumModel.findByIdAndUpdate(id, update, {
      returnDocument: 'after',
    });
    if (!updatedAlbum) {
      throw new RpcException(`Album with id ${id} not found`);
    }

    if (picture && existingAlbum.picture) {
      this.fileService.removeFile(existingAlbum.picture);
    }

    return updatedAlbum;
  }

  async getAll(
    query: string,
    count: number = 10,
    offset: number = 0,
  ): Promise<{ albums: Album[]; totalCount: number }> {
    const regex = new RegExp(escapeRegExp(query), 'i');
    const filter = { $or: [{ name: regex }, { author: regex }] };
    const [albums, totalCount] = await Promise.all([
      this.albumModel.find(filter).skip(offset).limit(count),
      this.albumModel.countDocuments(filter),
    ]);
    return { albums, totalCount };
  }

  async getOne(id: string): Promise<Album | null> {
    return this.albumModel.findById(id);
  }

  async delete(id: string): Promise<Types.ObjectId> {
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) {
      throw new RpcException(`Album with id ${id} not found`);
    }
    await this.trackModel.updateMany(
      { album: album._id },
      { $unset: { album: 1 } },
    );
    if (album.picture) {
      this.fileService.removeFile(album.picture);
    }
    return album._id;
  }

  count(): Promise<number> {
    return this.albumModel.countDocuments().exec();
  }
}
