import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({
    example: 'Bohemian Rhapsody',
    description: 'Name of the track',
  })
  @IsString({ message: 'Should be in string format' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  readonly name: string;

  @ApiProperty({ example: 'Queen', description: 'Name of the artist' })
  @IsString({ message: 'Should be in string format' })
  @IsNotEmpty({ message: 'Artist cannot be empty' })
  readonly artist: string;

  @ApiProperty({
    example: 'Is this the real life...',
    description: 'Track lyrics/text',
  })
  @IsString({ message: 'Should be in string format' })
  @IsNotEmpty({ message: 'Text cannot be empty' })
  readonly text: string;
}
