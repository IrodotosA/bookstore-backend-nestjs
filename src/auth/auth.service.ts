import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    let user = await this.userModel.findOne({ email });
    if (user) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();

    return { message: 'Registration successful. You can now log in.' };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const token = this.jwtService.sign({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { token };
  }

  // HELPER (used by guards)
  async validateUser(payload: any) {
    return this.userModel.findById(payload.id);
  }
}