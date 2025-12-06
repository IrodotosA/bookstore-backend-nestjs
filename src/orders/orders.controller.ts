import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id as string, dto);
  }

  @Get('my')
  @UseGuards(AuthGuard)
  findMy(@Req() req) {
    return this.ordersService.findMyOrders(req.user.id as string);
  }

  @Put('cancel/:id')
  @UseGuards(AuthGuard)
  cancel(@Req() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(id, req.user.id as string);
  }

  // ADMIN ROUTES
  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, AdminGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
