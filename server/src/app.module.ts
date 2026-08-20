import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { AlbumModule } from './album/album.module';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'static'),
    }),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    TrackModule,
    FileModule,
    AlbumModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
