import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AlbumController } from './album/album.controller';
import { AuthController } from './auth/auth.controller';
import { JwtGuard } from './guards/jwt.guard';
import { StatsController } from './stats/stats.controller';
import { TracksController } from './tracks/tracks.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('PRIVATE_KEY'),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.AUTH_SERVICE_HOST ?? 'localhost',
            port: Number(process.env.AUTH_SERVICE_PORT ?? 4001),
          },
        }),
      },
      {
        name: 'CATALOG_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.CATALOG_SERVICE_HOST ?? 'localhost',
            port: Number(process.env.CATALOG_SERVICE_PORT ?? 4012),
          },
        }),
      },
    ]),
  ],
  controllers: [
    AuthController,
    UsersController,
    TracksController,
    AlbumController,
    StatsController,
  ],
  providers: [JwtGuard],
})
export class AppModule {}
