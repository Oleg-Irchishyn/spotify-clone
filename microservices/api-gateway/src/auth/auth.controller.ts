import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { toHttpException } from '../common/rpc-error.util';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

const TOKEN_COOKIE_NAME = 'token';
const TOKEN_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const COOKIE_OPTIONS: CookieOptions = { httpOnly: true, sameSite: 'lax' };

interface AuthMessageResult {
  token: string;
  user: { email: string; name: string; isActivated: boolean };
}

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Log in - forwarded to auth-service over TCP (auth.login)',
  })
  @Post('/login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.issueToken('auth.login', dto, res);
  }

  @ApiOperation({
    summary: 'Register - forwarded to auth-service over TCP (auth.register)',
  })
  @Post('/registration')
  async registration(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.issueToken('auth.register', dto, res);
  }

  @ApiOperation({ summary: 'Log out the current user' })
  @ApiBearerAuth('bearerAuth')
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @Post('/logout')
  @UseGuards(JwtGuard)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await firstValueFrom(
        this.authClient.send('auth.logout', { email: req.user?.email }),
      );
    } catch (error) {
      throw toHttpException(error);
    }
    res.clearCookie(TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
  }

  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiBearerAuth('bearerAuth')
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @Get('/me')
  @UseGuards(JwtGuard)
  async me(@Req() req: Request) {
    try {
      const user = await firstValueFrom(
        this.authClient.send('auth.me', { email: req.user?.email }),
      );
      return { user };
    } catch (error) {
      throw toHttpException(error);
    }
  }

  private async issueToken(
    pattern: 'auth.login' | 'auth.register',
    dto: LoginUserDto | CreateUserDto,
    res: Response,
  ) {
    try {
      const { token, user } = await firstValueFrom<AuthMessageResult>(
        this.authClient.send(pattern, dto),
      );
      res.cookie(TOKEN_COOKIE_NAME, token, {
        ...COOKIE_OPTIONS,
        maxAge: TOKEN_COOKIE_MAX_AGE_MS,
      });
      return { user };
    } catch (error) {
      throw toHttpException(error);
    }
  }
}
