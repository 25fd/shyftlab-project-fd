/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { Student, StudentDocument } from "./student.entity";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Result, ResultDocument } from "../result/result.entity";
import { getDateDiffInYear } from "./utils";

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>,
              @InjectModel(Result.name) private resultModel: Model<ResultDocument>,) {}

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async createStudent(student: Student): Promise<Student> {
    const studentExists = await this.studentModel.findOne({ email: student.email })
    if (studentExists) {
      throw new BadRequestException('Student with email already exists');
    }
    const yearDiff = getDateDiffInYear(student.dateOfBirth);
    if (yearDiff < 10) {
      throw new BadRequestException('Student must be at least 10 years old');
    }
    const newStudent = new this.studentModel(student);
    return newStudent.save();
  }

  async deleteStudent(id: string): Promise<boolean> {
    await this.resultModel.deleteMany({ student: id });
    await this.studentModel.findByIdAndDelete(id);
     return  true;
  }
}