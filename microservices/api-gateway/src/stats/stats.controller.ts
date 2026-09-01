import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

import { toHttpException } from '../common/rpc-error.util';

// The concrete reason an API Gateway is more than a dumb reverse proxy: the
// client gets one round trip and one response, even though three separate
// services (two of them different databases) had to be asked.
@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary:
      'Composed counts from auth-service and catalog-service in a single response',
  })
  @Get()
  async getStats() {
    try {
      const [{ count: userCount }, { count: trackCount }, { count: albumCount }] =
        await Promise.all([
          firstValueFrom<{ count: number }>(
            this.authClient.send('users.count', {}),
          ),
          firstValueFrom<{ count: number }>(
            this.catalogClient.send('tracks.count', {}),
          ),
          firstValueFrom<{ count: number }>(
            this.catalogClient.send('album.count', {}),
          ),
        ]);

      return { userCount, trackCount, albumCount };
    } catch (error) {
      throw toHttpException(error);
    }
  }
}
