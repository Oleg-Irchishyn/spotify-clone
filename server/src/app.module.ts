import { createKeyv } from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import IORedis from 'ioredis';
import * as path from 'node:path';

import { AlbumModule } from './album/album.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';
import { UsersModule } from './users/users.module';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

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
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: new IORedis(REDIS_URL, { maxRetriesPerRequest: null }),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [createKeyv(REDIS_URL, { namespace: 'spotify-clone' })],
        ttl: 30_000,
      }),
    }),
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
