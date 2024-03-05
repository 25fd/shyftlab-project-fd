import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Student } from '../students/student.entity';
import { Course } from '../course/course.entity';

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
  student: Student;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  })
  course: Course;

  @Prop({
    type: String,
    enum: [Score.A, Score.B, Score.C, Score.D, Score.E, Score.F],
  })
  score: Score;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
