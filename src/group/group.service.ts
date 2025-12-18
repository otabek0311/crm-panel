import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = new this.groupModel(createGroupDto);
    return group.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec();
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.groupModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount === 1 };
  }

  async findByTeacher(teacherId: string): Promise<Group[]> {
    return this.groupModel.find({ teacherId }).exec();
  }

  async findByCourse(courseId: string): Promise<Group[]> {
    return this.groupModel.find({ courseId }).exec();
  }

  async addStudent(groupId: string, studentId: string): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { studentIds: studentId } },
      { new: true }
    ).exec();
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async removeStudent(groupId: string, studentId: string): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(
      groupId,
      { $pull: { studentIds: studentId } },
      { new: true }
    ).exec();
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async getStatistics(): Promise<any> {
    const groups = await this.groupModel.find().exec();
    const totalGroups = groups.length;
    const activeGroups = groups.filter(g => g.status === 'active').length;
    const completedGroups = groups.filter(g => g.status === 'completed').length;
    const totalStudents = groups.reduce((sum, group) => sum + group.studentIds.length, 0);
    const averageStudentsPerGroup = totalGroups > 0 ? (totalStudents / totalGroups).toFixed(2) : 0;

    return {
      totalGroups,
      activeGroups,
      completedGroups,
      totalStudents,
      averageStudentsPerGroup,
    };
  }
}
