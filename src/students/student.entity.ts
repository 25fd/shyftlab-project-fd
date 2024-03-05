/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";


export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student {


  @Prop(
    {
      required: true,
      type: String
    }
  )
  firstName: string;


  @Prop(
    {
      required: true,
      type: String
    }
  )
  familyName: string;


  @Prop({
    type: String,
    required: true,
    unique: true
  })
  email: string;

  @Prop(
    {
      required: true,
      type: String
    }
  )
  dateOfBirth: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);