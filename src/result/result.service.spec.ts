import { Test, TestingModule } from '@nestjs/testing';
import { ResultService } from './result.service';
import { getModelToken } from '@nestjs/mongoose';
import { Result } from './result.entity';
import { BadRequestException } from '@nestjs/common';

const student = {
  _id: 'student1',
  firstName: 'John',
  familyName: 'Doe',
  email: 'a@a.com',
  dateOfBirth: '2002-01-01',
};

const course = { _id: 'course1', courseName: 'Math' };

const mockResults = [
  {
    _id: 'result1',
    student: student,
    course: course,
    score: 'A',
  },
];

const mockResultModel = function () {};
mockResultModel.find = jest.fn(() => ({
  populate: jest
    .fn(() => {
      return {
        populate: jest.fn(),
        exec: jest.fn(),
      };
    })
    .mockReturnThis(),
  exec: jest.fn(),
}));
mockResultModel.findById = jest.fn();
mockResultModel.findByIdAndDelete = jest.fn();
mockResultModel.prototype.save = jest.fn();
mockResultModel.findOne = jest.fn();
mockResultModel.findOneAndUpdate = jest.fn();

const mockStudentModel = {
  findById: jest.fn(),
};

const mockCourseModel = {
  findById: jest.fn(),
};
const input = {
  student: 'student1',
  course: 'course1',
  score: 'A',
};

describe('ResultService', () => {
  let service: ResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultService,
        {
          provide: getModelToken(Result.name),
          useValue: mockResultModel,
        },
        {
          provide: getModelToken('Student'),
          useValue: mockStudentModel,
        },
        {
          provide: getModelToken('Course'),
          useValue: mockCourseModel,
        },
      ],
    }).compile();

    service = module.get<ResultService>(ResultService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a result', async () => {
      mockStudentModel.findById.mockReturnValueOnce(student);
      mockCourseModel.findById.mockReturnValueOnce(course);
      mockResultModel.findOne.mockReturnValueOnce(null);
      mockResultModel.prototype.save.mockReturnValueOnce(mockResults[0]);

      const result = await service.create(input);

      expect(mockStudentModel.findById).toHaveBeenCalledWith('student1');
      expect(mockCourseModel.findById).toHaveBeenCalledWith('course1');
      expect(mockResultModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockResults[0]);
    });

    it('should throw an error if student not found', async () => {
      mockStudentModel.findById.mockReturnValueOnce(null);
      try {
        await service.create(input);
      } catch (error) {
        expect(mockStudentModel.findById).toHaveBeenCalledWith('student1');
        expect(mockCourseModel.findById).not.toHaveBeenCalled();
        expect(mockResultModel.prototype.save).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw an error if course not found', async () => {
      mockStudentModel.findById.mockReturnValueOnce(student);
      mockCourseModel.findById.mockReturnValueOnce(null);

      try {
        await service.create(input);
      } catch (error) {
        expect(mockStudentModel.findById).toHaveBeenCalledWith('student1');
        expect(mockCourseModel.findById).toHaveBeenCalledWith('course1');
        expect(mockResultModel.prototype.save).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should update result if it exists', async () => {
      const updatedInput = { ...input, score: 'A' };
      const updatedResult = { ...mockResults[0], score: 'A' };

      mockStudentModel.findById.mockReturnValueOnce(student);
      mockCourseModel.findById.mockReturnValueOnce(course);
      mockResultModel.findOne.mockReturnValueOnce(mockResults[0]);
      mockResultModel.findOneAndUpdate.mockReturnValueOnce(updatedResult);

      const result = await service.create(updatedInput);

      expect(mockStudentModel.findById).toHaveBeenCalledWith('student1');
      expect(mockCourseModel.findById).toHaveBeenCalledWith('course1');
      expect(mockResultModel.findOne).toHaveBeenCalledWith({
        student: 'student1',
        course: 'course1',
      });
      expect(mockResultModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockResults[0]._id },
        { score: 'A' },
        { new: true },
      );
      expect(result).toEqual(updatedResult);
    });
  });

  describe('findAll', () => {
    it('should find all results and populate student and course', async () => {
      mockResultModel.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({
            exec: jest.fn().mockResolvedValueOnce(mockResults),
          }),
        }),
        exec: jest.fn().mockResolvedValueOnce(mockResults),
      });

      const results = await service.findAll();

      expect(mockResultModel.find).toHaveBeenCalled();
      expect(results).toEqual(mockResults);
    });
  });

  describe('delete', () => {
    it('should delete a result by id', async () => {
      mockResultModel.findByIdAndDelete.mockReturnValueOnce(true);

      const result = await service.delete('deletedResultId');

      expect(mockResultModel.findByIdAndDelete).toHaveBeenCalledWith(
        'deletedResultId',
      );
      expect(result).toEqual(true);
    });
  });
});
