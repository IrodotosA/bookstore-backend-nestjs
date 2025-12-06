import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req) {
    return this.wishlistService.getWishlist(req.user.id as string);
  }

  @Post('add')
  addItem(@Req() req, @Body('bookId') bookId: string) {
    return this.wishlistService.addItem(req.user.id as string, bookId);
  }

  @Delete('remove/:bookId')
  remove(@Req() req, @Param('bookId') bookId: string) {
    return this.wishlistService.removeItem(req.user.id as string, bookId);
  }

  @Delete('clear')
  clear(@Req() req) {
    return this.wishlistService.clear(req.user.id as string);
  }
}
