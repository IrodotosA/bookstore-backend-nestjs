import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  // ADMIN: Get all users
  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  findAll() {
    return this.service.findAll();
  }

  // ADMIN: Get one user
  @Get(':id')
  @UseGuards(AuthGuard, AdminGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // USER: Get my profile
  @Get('me/profile')
  @UseGuards(AuthGuard)
  getMe(@Req() req: any) {
    return this.service.getMe(req.user.id);
  }

  // USER: Update my profile
  @Put('me')
  @UseGuards(AuthGuard)
  updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.service.updateMe(req.user.id, dto);
  }

  // USER: Change password
  @Put('me/change-password')
  @UseGuards(AuthGuard)
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.service.changePassword(req.user.id, dto);
  }

  // ADMIN: Create a user
  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  // ADMIN: Update user
  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.updateUser(id, dto);
  }

  // ADMIN: Delete user
  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
