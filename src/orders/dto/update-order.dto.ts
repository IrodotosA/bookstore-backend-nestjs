import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
//   IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BillingDto, OrderItemDto } from './create-order.dto';

export class UpdateOrderDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BillingDto)
  billing?: BillingDto;

  @IsOptional()
  @IsEnum(['pending', 'shipped', 'completed', 'canceled'])
  status?: 'pending' | 'shipped' | 'completed' | 'canceled';
}
