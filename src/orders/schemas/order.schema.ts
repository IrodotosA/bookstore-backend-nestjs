import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;
}

@Schema()
export class Billing {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) postalCode: string;
  @Prop({ required: true }) country: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ type: Billing, required: true })
  billing: Billing;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ type: String, default: null })
  cardLast4: string | null;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: ['pending', 'shipped', 'completed', 'canceled'], default: 'pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
