import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ default: null })
  imageUrl: string;

  @Prop({ default: false })
  featured: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
