import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Student } from '../students/student.entity';
import { Course } from '../course/course.entity';
import { IsNotEmpty } from 'class-validator';

export type ResultDocument = HydratedDocument<Result>;

export enum Score {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

@Schema()
export class Result {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  })
  @IsNotEmpty()
  student: Student;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  })
  @IsNotEmpty()
  course: Course;

  @Prop()
  @IsNotEmpty()
  score: Score;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
