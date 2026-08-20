import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ValidationErrorDto } from 'src/exceptions/dto/validation-error.dto';

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
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }
}
