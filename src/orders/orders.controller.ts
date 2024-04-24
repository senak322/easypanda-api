import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.findAll();
  }
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  @Patch(':hash/close')
  async closeOrder(@Param('hash') hash: string, @Res() res: Response) {
    try {
      const message = await this.ordersService.closeOrder(hash);
      return res.status(200).json({ message });
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
      }
    }
  }
}
