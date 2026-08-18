import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileModule } from 'src/file/file.module';
import { Track, TrackSchema } from 'src/track/schemas/track.schema';

import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album, AlbumSchema } from './schemas/album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
    FileModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
