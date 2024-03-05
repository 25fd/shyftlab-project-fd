import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from './student.entity';
import { Result } from '../result/result.entity';
import { BadRequestException } from '@nestjs/common';
const student: Student = {
  firstName: 'John',
  familyName: 'Doe',
  email: 'john.doe@example.com',
  dateOfBirth: new Date('2002-01-01').toDateString(),
};
describe('StudentService', () => {
  let service: StudentService;

  const mockStudentModel = function () {};
  mockStudentModel.prototype.save = jest.fn();
  mockStudentModel.findOne = jest.fn();

  const mockResultModel = {
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getModelToken(Student.name),
          useValue: mockStudentModel,
        },
        {
          provide: getModelToken(Result.name),
          useValue: mockResultModel,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createStudent', () => {
    it('should create a new student', async () => {
      const student: Student = {
        firstName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        dateOfBirth: new Date('2002-01-01').toDateString(),
      };

      mockStudentModel.findOne.mockResolvedValue(null);
      mockStudentModel.prototype.save.mockResolvedValue(student);

      const result = await service.createStudent(student);

      expect(result).toEqual(student);
      expect(mockStudentModel.findOne).toHaveBeenCalledWith({
        email: student.email,
      });
      expect(mockStudentModel.prototype.save).toHaveBeenCalled();
    });

    it('should throw an error if the student with the same email already exists', async () => {
      mockStudentModel.findOne.mockResolvedValue(student);

      try {
        await service.createStudent(student);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Student with email already exists');
      }
    });

    it('should throw an error if the student is less than 10 years old', async () => {
      const student: Student = {
        firstName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        dateOfBirth: new Date().toDateString(),
      };

      mockStudentModel.findOne.mockResolvedValue(null);

      try {
        await service.createStudent(student);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Student must be at least 10 years old');
      }
    });
  });
});
