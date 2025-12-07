import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from '../orders/schemas/order.schema';
import { User } from '../auth/schemas/user.schema';
import { Book } from '../books/schemas/book.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async getStats() {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    // Total revenue (last 30 days, completed)
    const revenueAgg = await this.orderModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: { _id: null, revenue: { $sum: '$totalPrice' } },
      },
    ]);

    const totalRevenueLast30Days = revenueAgg[0]?.revenue || 0;

    // Total orders in last 30 days
    const totalOrdersLast30Days = await this.orderModel.countDocuments({
      createdAt: { $gte: last30Days },
    });

    // Pending orders now
    const pendingOrders = await this.orderModel.countDocuments({
      status: 'pending',
    });

    // Count users
    const totalUsers = await this.userModel.countDocuments();

    // Count books
    const totalBooks = await this.bookModel.countDocuments();

    // Orders per day by status
    const rawStatusData = await this.orderModel.aggregate([
      {
        $match: { createdAt: { $gte: last30Days } },
      },
      {
        $group: {
          _id: {
            status: '$status',
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.status': 1, '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const ordersByStatus = {
      pending: [],
      shipped: [],
      completed: [],
      canceled: [],
    };

    rawStatusData.forEach((item) => {
      const status = item._id.status;

      const date = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(
        item._id.day,
      ).padStart(2, '0')}`;

      if (ordersByStatus[status]) {
        ordersByStatus[status].push({
          date,
          count: item.count,
        });
      }
    });

    return {
      totalRevenueLast30Days,
      totalOrdersLast30Days,
      pendingOrders,
      totalUsers,
      totalBooks,
      ordersByStatus,
    };
  }
}
