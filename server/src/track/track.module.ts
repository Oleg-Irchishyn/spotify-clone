import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from 'src/file/file.module';
import { UsersModule } from 'src/users/users.module';

import { Comment, CommentSchema } from './schemas/comment.schema';
import { Track, TrackSchema } from './schemas/track.schema';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    FileModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
