import { IsNotEmpty } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  courseName: string;
}
