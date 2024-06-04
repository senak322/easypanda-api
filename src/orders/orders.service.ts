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
import { FileDetailsDocument, FileDetails } from './schemas/file.schema';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { OrderWithFiles } from './dto/order-with-files.dto';
// import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(FileDetails.name)
    private fileDetailsModel: Model<FileDetailsDocument>,
  ) {}

  async findAll(): Promise<Order[]> {
    try {
      return this.orderModel.find().exec();
    } catch (error) {
      throw new NotFoundException('Could not find orders');
    }
  }
  async getApprovedOrders(): Promise<Order[]> {
    try {
      return this.orderModel.find({ status: 'approved' }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find orders');
    }
  }
  async getWaitingOrders(): Promise<OrderWithFiles[]> {
    try {
      const orders = await this.orderModel
        .find({ status: 'waitingApprove' })
        .exec();
      return orders.map((order) => {
        const fileUrls = this.getFileUrls(order.hash);
        return { ...order.toObject(), fileUrls } as OrderWithFiles;
      });
    } catch (error) {
      throw new NotFoundException('Could not find orders');
    }
  }

  private getFileUrls(hash: string): string[] {
    const uploadPath = join(__dirname, '../../uploads', hash);
    if (existsSync(uploadPath)) {
      const files = readdirSync(uploadPath);
      return files.map(
        (file) => `http://localhost:3001/orders/${hash}/files/${file}`,
      );
    }
    return [];
  }
  async create(
    createOrderDto: CreateOrderDto,
    fileDetails: any[],
  ): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    createdOrder.files = fileDetails;
    return createdOrder.save();
  }

  async findOrderByHash(hash: string): Promise<Order> {
    const order = await this.orderModel.findOne({ hash });
    if (!order) {
      throw new NotFoundException(`Order with hash ${hash} not found.`);
    }

    return order;
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

  async acceptOrder(hash: string, file: any): Promise<OrderWithFiles> {
    const order = await this.orderModel.findOne({ hash });
    if (!order) {
      throw new NotFoundException(`Order with hash ${hash} not found.`);
    }
    order.files.push(file);
    order.status = 'waitingApprove';
    await order.save();
    const fileUrls = this.getFileUrls(hash);
    return { ...order.toObject(), fileUrls } as OrderWithFiles;
  }

  async approveOrder(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Устанавливаем статус только если это допустимо
    if (order.status !== 'approved') {
      order.status = 'approved';
      await order.save();
    } else {
      throw new BadRequestException(
        'Order cannot be updated from approved status',
      );
    }

    return order;
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
