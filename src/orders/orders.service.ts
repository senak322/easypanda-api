import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findAll(): Promise<Order[]> {
    try {
      return this.orderModel.find().exec();
    } catch (error) {
      throw new NotFoundException('Could not find orders');
    }
  }
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const createdOrder = new this.orderModel(createOrderDto);
      return await createdOrder.save();
    } catch (error) {
      throw new BadRequestException('Could not create order: ' + error);
    }
  }
  async closeOrder(hash: string): Promise<string> {
    const order = await this.orderModel.findOne({ hash });

    if (!order) {
      throw new NotFoundException(`Order with hash ${hash} not found.`);
    }

    if (order.status === 'closed') {
      return 'Order is already closed.';
    }

    if (order.status === 'completed') {
      return 'Order has been completed and cannot be closed.';
    }

    await order.updateOne({ status: 'closed' });

    return 'Order successfully closed.';
  }

  @Cron(CronExpression.EVERY_MINUTE) // или другой интервал
  async checkPendingOrders() {
    const now = new Date();
    const orders = await this.orderModel.updateMany(
      {
        status: 'pending',
        expiresAt: { $lte: now },
      },
      {
        $set: { status: 'cancelledByTimer' },
      },
    );
    if (orders.modifiedCount > 0) {
      console.log('Expired orders cancelled by timer:', orders.modifiedCount);
    }
  }
}
