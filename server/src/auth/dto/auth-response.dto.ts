import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  readonly email: string;

  @ApiProperty({ example: 'John Doe', description: 'Name' })
  readonly name: string;

  @ApiProperty({
    example: true,
    description:
      'Whether the access token (set as an httpOnly cookie) is currently valid',
  })
  readonly isActivated: boolean;
}

export class AuthResponseDto {
  @ApiProperty({
    type: AuthUserDto,
    description:
      'The logged in / registered user. The access token itself is set as an httpOnly cookie and is not exposed in the response body.',
  })
  readonly user: AuthUserDto;
}
