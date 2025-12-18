import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  teacherId: Types.ObjectId;

  @Prop({ required: true })
  courseId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], default: [] })
  studentIds: Types.ObjectId[];

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: 'active' })
  status: string; // active, completed, archived

  @Prop({ default: '' })
  description: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
