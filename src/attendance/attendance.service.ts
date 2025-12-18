import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(@InjectModel(Attendance.name) private attendanceModel: Model<Attendance>) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const attendance = new this.attendanceModel(createAttendanceDto);
    return attendance.save();
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.find().exec();
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findById(id).exec();
    if (!attendance) throw new NotFoundException('Attendance not found');
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.attendanceModel.findByIdAndUpdate(id, updateAttendanceDto, { new: true }).exec();
    if (!attendance) throw new NotFoundException('Attendance not found');
    return attendance;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.attendanceModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount === 1 };
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    return this.attendanceModel.find({ studentId }).exec();
  }

  async findByGroup(groupId: string): Promise<Attendance[]> {
    return this.attendanceModel.find({ groupId }).exec();
  }

  async getStatistics(studentId?: string, groupId?: string): Promise<any> {
    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (groupId) query.groupId = groupId;

    const attendances = await this.attendanceModel.find(query).exec();
    
    const totalDays = attendances.length;
    const present = attendances.filter(a => a.status === 'present').length;
    const absent = attendances.filter(a => a.status === 'absent').length;
    const late = attendances.filter(a => a.status === 'late').length;
    const excused = attendances.filter(a => a.status === 'excused').length;

    return {
      totalDays,
      present,
      absent,
      late,
      excused,
      attendanceRate: totalDays > 0 ? ((present / totalDays) * 100).toFixed(2) : 0,
    };
  }
}
