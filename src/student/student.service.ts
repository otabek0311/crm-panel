import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<Student>) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = new this.studentModel(createStudentDto);
    return student.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).exec();
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.studentModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount === 1 };
  }

  async findByGroup(groupId: string): Promise<Student[]> {
    return this.studentModel.find({ groupId }).exec();
  }

  async findByStatus(status: string): Promise<Student[]> {
    return this.studentModel.find({ status }).exec();
  }

  async getStatistics(): Promise<any> {
    const students = await this.studentModel.find().exec();
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const inactiveStudents = students.filter(s => s.status === 'inactive').length;
    const graduatedStudents = students.filter(s => s.status === 'graduated').length;

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      graduatedStudents,
    };
  }
}
