import { Controller } from '@nestjs/common';
import { CourseService } from './course.service';
import { Get, Post, Param, Delete, Body } from '@nestjs/common';
import { CourseDto } from './course.dto';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  async findAll() {
    return this.courseService.findAll();
  }

  @Post()
  async create(@Body() course: CourseDto) {
    return this.courseService.create(course);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.courseService.delete(id);
  }
}
