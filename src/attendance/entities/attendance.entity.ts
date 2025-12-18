import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Attendance extends Document {
  @Prop({ required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true })
  groupId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  status: string; // present, absent, late, excused

  @Prop({ default: '' })
  comment: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
