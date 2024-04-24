import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async hasAdmin(): Promise<boolean> {
    const adminCount = await this.userModel.countDocuments({ role: 'admin' });
    return adminCount > 0;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    console.log('Attempting to create admin with:', createUserDto);

    if (!createUserDto || !createUserDto.password) {
      console.error('Failed to create admin: Password is required');
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      username: createUserDto.username,
      password: hashedPassword,
      role: 'admin',
    });
    return newUser.save();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }
}
