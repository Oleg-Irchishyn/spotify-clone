import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from 'src/file/file.module';
import { UsersModule } from 'src/users/users.module';

import { ListensProcessor } from './listens.processor';
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
    BullModule.registerQueue({
      name: 'track-listens',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
      },
    }),
    FileModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [TrackController],
  providers: [TrackService, ListensProcessor],
})
export class TrackModule {}
