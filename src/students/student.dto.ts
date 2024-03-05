import { IsDate, IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class StudentDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  familyName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  dateOfBirth: string;
}
