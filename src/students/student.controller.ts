import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.dto';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  @Post()
  async createStudent(@Body() student: Student) {
    return this.studentService.createStudent(student);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
