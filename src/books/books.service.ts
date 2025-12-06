import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const created = new this.bookModel(dto);
    return created.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().sort({ createdAt: -1 }).exec();
  }

  async findFeatured(): Promise<Book[]> {
    return this.bookModel.find({ featured: true }).sort({ createdAt: -1 }).exec();
  }

  async findNewest(): Promise<Book[]> {
    return this.bookModel.find().sort({ createdAt: -1 }).limit(4).exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const updated = await this.bookModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Book not found');
    return updated;
  }

  async updateFeatured(id: string, featured: boolean): Promise<Book> {
    const updated = await this.bookModel.findByIdAndUpdate(
      id,
      { featured },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Book not found');
    return updated;
  }

  async remove(id: string) {
    return this.bookModel.findByIdAndDelete(id);
  }
}
