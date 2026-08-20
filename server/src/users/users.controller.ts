import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ValidationErrorDto } from 'src/exceptions/dto/validation-error.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: Users,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ValidationErrorDto,
  })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiOkResponse({ description: 'List of all users', type: [Users] })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }
}
