import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // ADMIN: Get all users
  async findAll() {
    return this.userModel.find().select('-password');
  }

  // ADMIN: Get user by ID
  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // GET my profile
  async getMe(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }

  // UPDATE my profile + return new token
  async updateMe(userId: string, dto: UpdateProfileDto) {
    const updated = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .select('-password');

    if (!updated) {
        throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });

    return { user: updated, token };
  }

  // CHANGE PASSWORD
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  // ADMIN: Create a new user
  async createUser(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: dto.role || 'user',
    });

    await user.save();
    return { message: 'User created successfully' };
  }

  // ADMIN: Update existing user
  async updateUser(id: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.userModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // ADMIN: Delete user
  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id);
    return { message: 'User deleted' };
  }
}
