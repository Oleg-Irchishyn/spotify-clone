import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';

import { FileType } from 'src/common/enums/file-type.enum';
import { FileService } from 'src/file/file.service';
import { Track, TrackDocument } from 'src/track/schemas/track.schema';

import { escapeRegExp } from 'src/common/utils/regex.util';
import { CreateAlbumDto } from './dto/CreateAlbumDto';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private readonly albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private readonly trackModel: Model<TrackDocument>,
    private readonly fileService: FileService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async create(
    dto: CreateAlbumDto,
    picture: Express.Multer.File,
  ): Promise<Album> {
    const picturePath = await this.fileService.createFile(
      FileType.IMAGE,
      picture,
    );
    const album = await this.albumModel.create({
      ...dto,
      picture: picturePath,
    });
    await this.cache.clear();
    return album;
  }

  async update(
    id: string,
    dto: CreateAlbumDto,
    picture?: Express.Multer.File,
  ): Promise<Album> {
    const existingAlbum = await this.albumModel.findById(id, 'picture');
    if (!existingAlbum) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    const update: Partial<Album> = { ...dto };
    if (picture) {
      update.picture = await this.fileService.createFile(
        FileType.IMAGE,
        picture,
      );
    }

    const updatedAlbum = await this.albumModel.findByIdAndUpdate(id, update, {
      returnDocument: 'after',
    });
    if (!updatedAlbum) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    if (picture && existingAlbum.picture) {
      await this.fileService.removeFile(existingAlbum.picture);
    }

    await this.cache.clear();
    return updatedAlbum;
  }

  async getAll(
    query: string,
    count: number = 10,
    offset: number = 0,
  ): Promise<{ albums: Album[]; totalCount: number }> {
    const cacheKey = `albums:all:${query}:${count}:${offset}`;
    const cached = await this.cache.get<{
      albums: Album[];
      totalCount: number;
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    const regex = new RegExp(escapeRegExp(query), 'i');
    const filter = { $or: [{ name: regex }, { author: regex }] };
    const [albums, totalCount] = await Promise.all([
      this.albumModel.find(filter).skip(offset).limit(count),
      this.albumModel.countDocuments(filter),
    ]);
    const result = { albums, totalCount };
    await this.cache.set(cacheKey, result);
    return result;
  }

  async getOne(id: string): Promise<Album | null> {
    const album = await this.albumModel.findById(id);
    return album;
  }

  async delete(id: string): Promise<Types.ObjectId> {
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    await this.trackModel.updateMany(
      { album: album._id },
      { $unset: { album: 1 } },
    );
    if (album.picture) {
      await this.fileService.removeFile(album.picture);
    }
    await this.cache.clear();
    return album._id;
  }
}
