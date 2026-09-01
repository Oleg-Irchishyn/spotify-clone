import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { Model, Types } from 'mongoose';

import { escapeRegExp } from '../common/regex.util';
import { FileType } from '../common/file-type.enum';
import { FileService, UploadedFilePayload } from '../file/file.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Track, TrackDocument } from './schemas/track.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name)
    private readonly trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateTrackDto,
    picture: UploadedFilePayload,
    audio: UploadedFilePayload,
  ): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    return this.trackModel.create({
      ...dto,
      listens: 0,
      picture: picturePath,
      audio: audioPath,
    });
  }

  async update(
    id: string,
    dto: CreateTrackDto,
    picture?: UploadedFilePayload,
    audio?: UploadedFilePayload,
  ): Promise<Track> {
    const existingTrack = await this.trackModel.findById(id, 'picture audio');
    if (!existingTrack) {
      throw new RpcException(`Track with id ${id} not found`);
    }

    const update: Partial<Track> = {
      ...dto,
      album: dto.album as unknown as Types.ObjectId | undefined,
    };
    if (picture) {
      update.picture = this.fileService.createFile(FileType.IMAGE, picture);
    }
    if (audio) {
      update.audio = this.fileService.createFile(FileType.AUDIO, audio);
    }

    const updatedTrack = await this.trackModel.findByIdAndUpdate(id, update, {
      returnDocument: 'after',
    });
    if (!updatedTrack) {
      throw new RpcException(`Track with id ${id} not found`);
    }

    if (picture && existingTrack.picture) {
      this.fileService.removeFile(existingTrack.picture);
    }
    if (audio && existingTrack.audio) {
      this.fileService.removeFile(existingTrack.audio);
    }

    return updatedTrack;
  }

  async getAll(
    count: number = 10,
    offset: number = 0,
    albumId?: string,
  ): Promise<{ tracks: Track[]; totalCount: number }> {
    const filter = albumId ? { album: albumId } : {};
    const [tracks, totalCount] = await Promise.all([
      this.trackModel.find(filter).skip(offset).limit(count),
      this.trackModel.countDocuments(filter),
    ]);
    return { tracks, totalCount };
  }

  async getOne(id: string): Promise<Track | null> {
    return this.trackModel.findById(id).populate('comments');
  }

  async delete(id: string): Promise<Types.ObjectId | null> {
    const track = await this.trackModel.findByIdAndDelete(id);
    if (!track) {
      return null;
    }
    if (track.picture) {
      this.fileService.removeFile(track.picture);
    }
    if (track.audio) {
      this.fileService.removeFile(track.audio);
    }
    return track._id;
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create(dto);
    track?.comments.push(comment._id);
    await track?.save();
    return comment;
  }

  async listen(id: string): Promise<{ success: true }> {
    // See the note on AuthService.logout: a @MessagePattern handler that
    // resolves to undefined never emits a value for the caller's
    // firstValueFrom() to receive - always return something.
    const track = await this.trackModel.findById(id);
    if (track) {
      track.listens += 1;
      await track.save();
    }
    return { success: true };
  }

  async search(
    query: string,
    count: number = 10,
    offset: number = 0,
    albumId?: string,
  ): Promise<{ tracks: Track[]; totalCount: number }> {
    const regex = new RegExp(escapeRegExp(query), 'i');
    const filter = {
      $or: [{ name: regex }, { artist: regex }, { text: regex }],
      ...(albumId ? { album: albumId } : {}),
    };
    const [tracks, totalCount] = await Promise.all([
      this.trackModel.find(filter).skip(offset).limit(count),
      this.trackModel.countDocuments(filter),
    ]);
    return { tracks, totalCount };
  }

  count(): Promise<number> {
    return this.trackModel.countDocuments().exec();
  }
}
