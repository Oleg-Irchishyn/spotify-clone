import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.BAD_REQUEST,
      );
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
      token: this.jwtService.sign(payload),
      user: { email: user.email, name: user.name, isActivated: true },
    };
  }

  async logout(email: string): Promise<void> {
    await this.usersService.setActivated(email, false);
  }

  private async validateUser(dto: LoginUserDto): Promise<UsersDocument> {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }

    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }

    return user;
  }
}
