import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student } from './student.entity';

import { Result, ResultSchema } from '../result/result.entity';

const student = {
  firstName: 'John',
  familyName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: new Date('2002-01-01').toDateString(),
};
const result: Student[] = [student];
describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  const mockStudentModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
    // updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        StudentService,
        {
          provide: getModelToken(Student.name),
          useValue: mockStudentModel,
        },
        {
          provide: getModelToken(Result.name),
          useValue: ResultSchema,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('createStudent', () => {
    it('should create a new student', async () => {
      jest.spyOn(service, 'createStudent').mockResolvedValue(student);

      expect(await controller.createStudent(student)).toBe(student);
      expect(service.createStudent).toHaveBeenCalledWith(student);
    });

    it('should throw an error if the student with the same email already exists', async () => {
      jest
        .spyOn(service, 'createStudent')
        .mockRejectedValue(new Error('Student with email already exists'));

      try {
        await controller.createStudent(student);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Student with email already exists');
      }
    });

    it('should throw an error if the student is less than 10 years old', async () => {
      jest
        .spyOn(service, 'createStudent')
        .mockRejectedValue(new Error('Student must be at least 10 years old'));

      try {
        await controller.createStudent(student);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Student must be at least 10 years old');
      }
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student', async () => {
      const id = '1';

      jest.spyOn(service, 'deleteStudent').mockResolvedValue(true);

      expect(await controller.deleteStudent(id)).toBe(true);
      expect(service.deleteStudent).toHaveBeenCalledWith(id);
    });
  });
});
