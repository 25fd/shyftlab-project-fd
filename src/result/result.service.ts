import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from './result.entity';
import { StudentDocument } from '../students/student.entity';
import { CourseDocument } from '../course/course.entity';
import { ResultDto } from './result.dto';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel('Student') private studentModel: Model<StudentDocument>,
    @InjectModel('Course') private courseModel: Model<CourseDocument>,
  ) {}

  async create(result: ResultDto): Promise<Result> {
    const student = await this.studentModel.findById(result.student);
    if (!student) {
      throw new BadRequestException('Student not found');
    }
    const course = await this.courseModel.findById(result.course);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    const createdResult = new this.resultModel(result);
    return createdResult.save();
  }

  async findAll(): Promise<Result[]> {
    return this.resultModel
      .find()
      .populate('student')
      .populate('course')
      .exec();
  }
  async delete(id: string): Promise<boolean> {
    await this.resultModel.findByIdAndDelete(id);
    return true;
  }
}
