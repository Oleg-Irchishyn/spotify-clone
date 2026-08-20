import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @IsString({ message: 'Value should be in a string format' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @ApiProperty({ example: '12345', description: 'Password' })
  @IsString({ message: 'Value should be in a string format' })
  @Length(4, 16, { message: 'Not less than 4 and more than 16 symbols' })
  readonly password: string;
}
