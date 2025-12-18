import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Teacher extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  subject: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  address: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
