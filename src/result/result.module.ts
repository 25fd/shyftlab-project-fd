import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './result.entity';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { Student, StudentSchema } from '../students/student.entity';
import { Course, CourseSchema } from '../course/course.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
