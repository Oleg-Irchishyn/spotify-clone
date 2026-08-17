import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { FileType } from 'src/common/enums/file-type.enum';
import { FileService } from 'src/file/file.service';

import { escapeRegExp } from 'src/common/utils/regex.util';
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
    picture: Express.Multer.File,
    audio: Express.Multer.File,
  ): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      picture: picturePath,
      audio: audioPath,
    });
    return track;
  }

  async update(
    id: string,
    dto: CreateTrackDto,
    picture?: Express.Multer.File,
    audio?: Express.Multer.File,
  ): Promise<Track> {
    const existingTrack = await this.trackModel.findById(id, 'picture audio');
    if (!existingTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    const update: Partial<Track> = { ...dto };
    if (picture) {
      update.picture = this.fileService.createFile(FileType.IMAGE, picture);
    }
    if (audio) {
      update.audio = this.fileService.createFile(FileType.AUDIO, audio);
    }

    const updatedTrack = await this.trackModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updatedTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
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
  ): Promise<{ tracks: Track[]; totalCount: number }> {
    const [tracks, totalCount] = await Promise.all([
      this.trackModel.find().skip(offset).limit(count),
      this.trackModel.countDocuments(),
    ]);
    return { tracks, totalCount };
  }

  async getOne(id: string): Promise<Track | null> {
    const track = await this.trackModel.findById(id).populate('comments');
    return track;
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

  async listen(id: string): Promise<void> {
    const track = await this.trackModel.findById(id);
    if (track) {
      track.listens += 1;
      await track.save();
    }
  }

  async search(query: string): Promise<Track[]> {
    const regex = new RegExp(escapeRegExp(query), 'i');
    const tracks = await this.trackModel.find({
      $or: [{ name: regex }, { artist: regex }, { text: regex }],
    });
    return tracks;
  }
}
