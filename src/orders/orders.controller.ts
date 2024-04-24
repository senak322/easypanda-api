import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(Role.Admin)
  getAllOrders() {
    return this.ordersService.findAll();
  }
  @Get('approved')
  @Roles(Role.Admin)
  getApprovedOrders() {
    return this.ordersService.getApprovedOrders();
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
  @Patch(':id/approve')
  @Roles(Role.Admin)
  async confirmOrder(@Param('id') id: string) {
    return this.ordersService.approveOrder(id);
  }
}
