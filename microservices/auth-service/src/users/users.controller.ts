import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.getAll')
  async getAll() {
    return this.usersService.getAllUsers();
  }

  @MessagePattern('users.count')
  async count() {
    const count = await this.usersService.countUsers();
    return { count };
  }
}
