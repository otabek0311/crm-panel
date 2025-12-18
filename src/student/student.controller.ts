import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles('admin', 'teacher')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @Roles('admin', 'teacher', 'user')
  findAll() {
    return this.studentService.findAll();
  }

  @Get('statistics')
  @Roles('admin', 'teacher')
  getStatistics() {
    return this.studentService.getStatistics();
  }

  @Get('group/:groupId')
  @Roles('admin', 'teacher', 'user')
  findByGroup(@Param('groupId') groupId: string) {
    return this.studentService.findByGroup(groupId);
  }

  @Get('status/:status')
  @Roles('admin', 'teacher')
  findByStatus(@Param('status') status: string) {
    return this.studentService.findByStatus(status);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'user')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
