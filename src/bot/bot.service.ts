import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { Ticket } from './entities/bot.entity';

@Injectable()
export class BotService {
  constructor(@InjectModel('Ticket') private ticketModel: Model<Ticket>) {}

  async create(createBotDto: CreateBotDto) {
    try {
      const ticket = new this.ticketModel({
        studentId: new Types.ObjectId(createBotDto.studentId),
        studentName: createBotDto.studentName,
        studentEmail: createBotDto.studentEmail,
        title: createBotDto.title,
        description: createBotDto.description,
        status: 'open',
      });

      const savedTicket = await ticket.save();
      
      // O'qituvchiga xabar yuborish (email yoki notification)
      await this.notifyTeacher(savedTicket);

      return {
        success: true,
        message: 'Muammo muvaffaqiyatli yuborildi',
        ticketId: savedTicket._id,
      };
    } catch (error) {
      throw new BadRequestException('Muammoni yuborishda xato: ' + error.message);
    }
  }

  async findAll(status?: string) {
    const query = status ? { status } : {};
    return await this.ticketModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Noto\'g\'ri ID');
    }

    const ticket = await this.ticketModel.findById(id);
    if (!ticket) {
      throw new NotFoundException('Muammo topilmadi');
    }
    return ticket;
  }

  async update(id: string, updateBotDto: UpdateBotDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Noto\'g\'ri ID');
    }

    const ticket = await this.ticketModel.findByIdAndUpdate(id, updateBotDto, {
      new: true,
    });

    if (!ticket) {
      throw new NotFoundException('Muammo topilmadi');
    }

    return ticket;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Noto\'g\'ri ID');
    }

    const ticket = await this.ticketModel.findByIdAndDelete(id);
    if (!ticket) {
      throw new NotFoundException('Muammo topilmadi');
    }

    return { success: true, message: 'Muammo o\'chirildi' };
  }

  async respondToTicket(
    ticketId: string,
    response: string,
    teacherId: string,
  ) {
    if (!Types.ObjectId.isValid(ticketId)) {
      throw new BadRequestException('Noto\'g\'ri ID');
    }

    const ticket = await this.ticketModel.findByIdAndUpdate(
      ticketId,
      {
        teacherResponse: response,
        respondedAt: new Date(),
        respondedBy: new Types.ObjectId(teacherId),
        status: 'closed',
      },
      { new: true },
    );

    if (!ticket) {
      throw new NotFoundException('Muammo topilmadi');
    }

    return ticket;
  }

  private async notifyTeacher(ticket: Ticket) {
    // Bu yerda email yoki notification yuborish logikasi bo'ladi
    // Hozircha console.log bilan chiqarish
    console.log('O\'qituvchiga xabar yuborildi:', {
      ticketId: ticket._id,
      studentName: ticket.studentName,
      title: ticket.title,
      timestamp: new Date(),
    });

    // Keyinroq email service qo'shish mumkin:
    // await this.emailService.sendToTeacher(ticket);
  }
}
