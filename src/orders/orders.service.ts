import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  private orders = [];
  findAll() {
    return this.orders;
  }
  async create(createOrderDto: CreateOrderDto) {
    const newOrder = { id: Date.now().toString(), ...createOrderDto };
    // Save the new order to the database
    const savedOrder = await this.ordersRepository.save(newOrder);
    return savedOrder;
  }
}
