import { Module } from '@nestjs/common';
import { Student, StudentSchema } from './student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from '../result/result.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentsModule {}
