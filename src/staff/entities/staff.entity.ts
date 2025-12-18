import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  position: string; // lavozim

  @Prop({ default: 'active' })
  status: string; // active, inactive

  @Prop()
  address: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
