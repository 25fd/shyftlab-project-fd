import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.entity';
import { Result, ResultDocument } from '../result/result.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
  ) {}

  async create(course: Course): Promise<Course> {
    const courseExists = await this.courseModel.findOne({
      courseName: course.courseName,
    });
    if (courseExists) {
      throw new BadRequestException('Course already exists');
    }
    const createdCourse = new this.courseModel(course);
    return createdCourse.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find();
  }

  async delete(id: string): Promise<boolean> {
    await this.resultModel.deleteMany({ course: id });
    await this.courseModel.findByIdAndDelete(id);
    return true;
  }
}
