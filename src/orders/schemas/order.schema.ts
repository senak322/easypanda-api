import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order {
  @Prop()
  sendCurrency: string;

  @Prop()
  receiveCurrency: string;

  @Prop()
  sendAmount: number;

  @Prop()
  receiveAmount: number;

  @Prop()
  sendBank: string;

  @Prop()
  receiveBank: string;

  @Prop()
  ownerName: string;

  @Prop()
  ownerData: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: () => Date.now() + 30 * 60000 })
  expiresAt: Date;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
