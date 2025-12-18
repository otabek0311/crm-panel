import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentModel.findByIdAndUpdate(id, updatePaymentDto, { new: true }).exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.paymentModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount === 1 };
  }

  async findByStudent(studentId: string): Promise<Payment[]> {
    return this.paymentModel.find({ studentId }).exec();
  }

  async getStatistics(): Promise<any> {
    const payments = await this.paymentModel.find().exec();
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const averageAmount = payments.length > 0 ? totalAmount / payments.length : 0;
    
    return {
      totalPayments: payments.length,
      totalAmount,
      averageAmount,
    };
  }
}
