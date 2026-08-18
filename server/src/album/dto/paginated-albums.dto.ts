import { ApiProperty } from '@nestjs/swagger';

import { Album } from '../schemas/album.schema';

export class PaginatedAlbumsDto {
  @ApiProperty({ type: [Album], description: 'Albums for the requested page' })
  readonly albums: Album[];

  @ApiProperty({
    example: 42,
    description: 'Total number of albums matching the query',
  })
  readonly totalCount: number;
}
