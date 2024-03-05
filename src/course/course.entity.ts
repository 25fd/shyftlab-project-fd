import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  courseName: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
