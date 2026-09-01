import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import bcrypt from 'bcryptjs';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async registration(dto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(dto.email);

    if (candidate) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'User with such email already exists',
      });
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.usersService.createUser({
      ...dto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: UsersDocument) {
    await this.usersService.setActivated(user.email, true);

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      isActivated: true,
    };

    return {
      // Unlike the monolith (which only ever puts this in an httpOnly
      // cookie), this service has no way to talk to a browser at all — the
      // token has to travel back to the api-gateway in the message reply so
      // *it* can set the cookie.
      token: this.jwtService.sign(payload),
      user: { email: user.email, name: user.name, isActivated: true },
    };
  }

  async logout(email: string): Promise<{ success: true }> {
    // A @MessagePattern handler that resolves to undefined never emits a
    // value on the client's Observable (firstValueFrom then rejects with
    // "no elements in sequence") - always return something, even a bare ack.
    await this.usersService.setActivated(email, false);
    return { success: true };
  }

  async getCurrentUser(email: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'User is not authorized',
      });
    }

    return {
      email: user.email,
      name: user.name,
      isActivated: user.isActivated,
    };
  }

  private async validateUser(dto: LoginUserDto): Promise<UsersDocument> {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Incorrect email or password',
      });
    }

    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (!passwordEquals) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Incorrect email or password',
      });
    }

    return user;
  }
}
