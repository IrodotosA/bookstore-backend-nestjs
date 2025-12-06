import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../middleware/upload.middleware';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // CREATE book (admin)
  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateBookDto,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.booksService.create(dto);
  }

  // GET all books (public)
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  // GET featured books (public)
  @Get('featured')
  findFeatured() {
    return this.booksService.findFeatured();
  }

  // PATCH featured (admin)
  @Patch(':id/featured')
  @UseGuards(AuthGuard, AdminGuard)
  updateFeatured(@Param('id') id: string, @Body('featured') featured: boolean) {
    return this.booksService.updateFeatured(id, featured);
  }

  // GET newest books
  @Get('newest')
  findNewest() {
    return this.booksService.findNewest();
  }

  // GET single book (public)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  // UPDATE (admin)
  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateBookDto,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.booksService.update(id, dto);
  }

  // DELETE book (admin)
  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
