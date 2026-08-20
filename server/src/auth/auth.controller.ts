import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ValidationErrorDto } from 'src/exceptions/dto/validation-error.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({
    description: 'User successfully logged in. Returns an access token.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid email or password format (validation error)',
    type: ValidationErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Incorrect email or password',
  })
  @Post('/login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description: 'User successfully registered. Returns an access token.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error (e.g. password too short or invalid email)',
    type: ValidationErrorDto,
  })
  @Post('/registration')
  registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }
}
