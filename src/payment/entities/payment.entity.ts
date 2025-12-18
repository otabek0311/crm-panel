import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ default: 'cash' })
  method: string; // cash, card, transfer, etc.

  @Prop({ default: '' })
  comment: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
