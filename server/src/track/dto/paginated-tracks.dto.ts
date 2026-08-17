import { ApiProperty } from '@nestjs/swagger';

import { Track } from '../schemas/track.schema';

export class PaginatedTracksDto {
  @ApiProperty({ type: [Track], description: 'Tracks for the requested page' })
  readonly tracks: Track[];

  @ApiProperty({
    example: 42,
    description: 'Total number of tracks matching the query',
  })
  readonly totalCount: number;
}
