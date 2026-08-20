import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZXMiOlt7ImlkIjoxLCJ2YWx1ZSI6IkFETUlOIn1dfQ...',
    description: `Generated JWT access token (Bearer), that consists if User's ID and email`,
  })
  readonly token: string;
}
