import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  studentEmail: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'open' })
  status: 'open' | 'in_progress' | 'closed';

  @Prop({ default: null })
  teacherResponse: string;

  @Prop({ default: null })
  respondedAt: Date;

  @Prop({ default: null })
  respondedBy: Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
