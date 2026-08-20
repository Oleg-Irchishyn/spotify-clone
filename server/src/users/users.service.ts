import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { Users, UsersDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private readonly usersModel: Model<UsersDocument>,
  ) {}

  createUser(dto: CreateUserDto) {
    return this.usersModel.create(dto);
  }

  getAllUsers() {
    return this.usersModel.find().exec();
  }

  getUserByEmail(email: string) {
    return this.usersModel.findOne({ email }).exec();
  }

  setActivated(email: string, isActivated: boolean) {
    return this.usersModel.updateOne({ email }, { isActivated }).exec();
  }
}
