/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";


export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student {


  @Prop()
  firstName: string;


  @Prop()
  familyName: string;


  @Prop({
    unique: true
  })
  email: string;

  @Prop()
  dateOfBirth: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);