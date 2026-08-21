import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';

import {
  TOKEN_COOKIE_MAX_AGE_MS,
  TOKEN_COOKIE_NAME,
} from 'src/constants/auth.constants';
import { ValidationErrorDto } from 'src/exceptions/dto/validation-error.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({
    description:
      'User successfully logged in. The access token is set as an httpOnly cookie.',
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
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(dto);
    this.setTokenCookie(res, token);
    return { user };
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description:
      'User successfully registered. The access token is set as an httpOnly cookie.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error (e.g. password too short or invalid email)',
    type: ValidationErrorDto,
  })
  @Post('/registration')
  async registration(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.registration(dto);
    this.setTokenCookie(res, token);
    return { user };
  }

  @ApiOperation({ summary: 'Log out the current user' })
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.user) {
      await this.authService.logout(req.user.email);
    }
    this.clearTokenCookie(res);
  }

  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiOkResponse({
    description: 'The currently authenticated user',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiBearerAuth('bearerAuth')
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }

    const user = await this.authService.getCurrentUser(req.user.email);
    return { user };
  }

  private getCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      // Client and server are on different sites in production
      // (github.io vs. onrender.com), so the cookie must be sent
      // cross-site. SameSite=None requires Secure, which only
      // holds in production (both origins are HTTPS there).
      sameSite: isProduction ? 'none' : 'lax',
    };
  }

  private setTokenCookie(res: Response, token: string): void {
    res.cookie(TOKEN_COOKIE_NAME, token, {
      ...this.getCookieOptions(),
      maxAge: TOKEN_COOKIE_MAX_AGE_MS,
    });
  }

  private clearTokenCookie(res: Response): void {
    res.clearCookie(TOKEN_COOKIE_NAME, this.getCookieOptions());
  }
}
