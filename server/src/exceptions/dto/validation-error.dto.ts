import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code of the error (always 400 Bad Request)',
  })
  statusCode: number;

  @ApiProperty({
    type: [String],
    example: [
      'name - Name cannot be empty',
      'artist - Should be in string format',
    ],
    description: 'Array of formatted validation errors for your DTO fields',
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
    description: 'Standard HTTP error text description',
  })
  error: string;
}
