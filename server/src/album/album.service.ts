import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { FileType } from 'src/common/enums/file-type.enum';
import { FileService } from 'src/file/file.service';

import { escapeRegExp } from 'src/common/utils/regex.util';
import { CreateAlbumDto } from './dto/CreateAlbumDto';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private readonly albumModel: Model<AlbumDocument>,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateAlbumDto,
    picture: Express.Multer.File,
  ): Promise<Album> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const album = await this.albumModel.create({
      ...dto,
      picture: picturePath,
    });
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
      update.picture = this.fileService.createFile(FileType.IMAGE, picture);
    }

    const updatedAlbum = await this.albumModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updatedAlbum) {
      throw new NotFoundException(`Album with id ${id} not found`);
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
  ): Promise<Album[]> {
    const regex = new RegExp(escapeRegExp(query), 'i');
    const albums = await this.albumModel
      .find({
        $or: [{ name: regex }, { author: regex }],
      })
      .skip(offset)
      .limit(count);
    return albums;
  }

  async getOne(id: string): Promise<Album | null> {
    const album = await this.albumModel.findById(id).populate('tracks');
    return album;
  }

  async delete(id: string): Promise<Types.ObjectId> {
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    if (album.picture) {
      this.fileService.removeFile(album.picture);
    }
    return album._id;
  }
}
