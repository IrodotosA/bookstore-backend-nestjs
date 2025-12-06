import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const cardLast4 =
      dto.paymentMethod === 'card' && dto.cardNumber
        ? dto.cardNumber.slice(-4)
        : null;

    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      items: dto.items,
      totalPrice: dto.totalPrice,
      billing: dto.billing,
      paymentMethod: dto.paymentMethod,
      cardLast4,
    });

    await order.save();
    return order;
  }

  async findMyOrders(userId: string) {
    return this.orderModel
      .find({ userId: { $in: [userId, new Types.ObjectId(userId)] } })
      .sort({ createdAt: -1 });
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findOne({
      _id: orderId,
      userId,
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.status !== 'pending') {
      throw new BadRequestException('Only pending orders can be canceled');
    }

    order.status = 'canceled';
    await order.save();

    return order;
  }

  // Admin
  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  findOne(id: string) {
    return this.orderModel.findById(id);
  }

  async update(id: string, dto: UpdateOrderDto) {
    const updated = await this.orderModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
