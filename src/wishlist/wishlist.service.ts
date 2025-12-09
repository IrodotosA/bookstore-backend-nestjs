import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
  ) {}

  // Get or create wishlist
async getWishlist(userId: string) {
  const wishlist = await this.wishlistModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    {},
    { new: true, upsert: true },
  ).populate('items');

  return wishlist.items;
}

  // Add item
async addItem(userId: string, bookId: string) {
  const bookObjectId = new Types.ObjectId(bookId);

  const wishlist = await this.wishlistModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    {
      $addToSet: { items: bookObjectId }, // avoids duplicates
    },
    {
      new: true,
      upsert: true, // create if not exists
    },
  );

  return { message: 'Added to wishlist', wishlist };
}


  // Remove item
  async removeItem(userId: string, bookId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId: new Types.ObjectId(userId) });

    if (!wishlist)
      throw new NotFoundException('Wishlist not found');

    wishlist.items = wishlist.items.filter(
      id => id.toString() !== bookId,
    );

    await wishlist.save();

    return { message: 'Removed from wishlist' };
  }

  // Clear wishlist
  async clear(userId: string) {
    await this.wishlistModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) }, // FIXED QUERY
      { items: [] },
      { new: true }
    );

    return { message: 'Wishlist cleared' };
  }
}
