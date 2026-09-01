import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

import { toHttpException } from '../common/rpc-error.util';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary:
      'List all registered users - forwarded to auth-service (users.getAll)',
  })
  @Get()
  async getAll() {
    try {
      return await firstValueFrom(this.authClient.send('users.getAll', {}));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}
