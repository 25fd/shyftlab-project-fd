import { IsNotEmpty } from 'class-validator';
export class ResultDto {
  @IsNotEmpty()
  student: string;

  @IsNotEmpty()
  course: string;

  @IsNotEmpty()
  score: string;
}
