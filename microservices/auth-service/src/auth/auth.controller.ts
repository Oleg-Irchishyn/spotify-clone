import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import type { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import type { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  login(@Payload() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @MessagePattern('auth.register')
  registration(@Payload() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @MessagePattern('auth.logout')
  logout(@Payload() { email }: { email: string }) {
    return this.authService.logout(email);
  }

  @MessagePattern('auth.me')
  me(@Payload() { email }: { email: string }) {
    return this.authService.getCurrentUser(email);
  }
}
