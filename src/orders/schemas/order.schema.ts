import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order {
  @Prop({ required: true })
  userCookies: string;

  @Prop({ required: true })
  sendCurrency: string;

  @Prop({ required: true })
  receiveCurrency: string;

  @Prop({ required: true })
  sendAmount: number;

  @Prop({ required: true })
  receiveAmount: number;

  @Prop({ required: true })
  sendBank: string;

  @Prop({ required: true })
  receiveBank: string;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ required: true })
  ownerData: string;

  @Prop({ default: 'pending' }) //closed, closedByTimer, approved, waitingApprove
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: () => Date.now() + 30 * 60000 })
  expiresAt: Date;

  @Prop()
  qrCodeFileData: string; // Опционально для QR кодов

  @Prop({ required: true })
  hash: string;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
