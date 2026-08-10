import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    example: 'Best album in a world',
    description: 'Name of the album',
  })
  @IsString({ message: 'Should be in string format' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  readonly name: string;

  @ApiProperty({ example: 'Artist Name', description: 'Name of the artist' })
  @IsString({ message: 'Should be in string format' })
  @IsNotEmpty({ message: 'Author cannot be empty' })
  readonly author: string;
}
