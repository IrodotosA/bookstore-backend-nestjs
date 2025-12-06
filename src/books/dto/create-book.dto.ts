import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  author: string;

  @IsString()
  category: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
