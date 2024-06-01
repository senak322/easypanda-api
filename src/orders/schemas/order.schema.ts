import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileDetailsSchema } from './file.schema';
import { FileDetails } from '../intersaces/file-details';

@Schema()
export class Order {
  // @Prop({ required: true })
  // userCookies: string;

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

  @Prop({ type: [FileDetailsSchema], default: [] })
  files: FileDetails[]; // Добавляем свойство files для хранения файлов

  @Prop({ required: true })
  hash: string;
}

export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
