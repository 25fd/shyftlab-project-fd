import { Test, TestingModule } from '@nestjs/testing';
import { ResultService } from './result.service';
import { getModelToken } from '@nestjs/mongoose';
import { Result } from './result.entity';

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
    student: student,
    course: course,
    score: 'A',
  },
];

const mockResultModel = {
  find: jest.fn(() => ({
    populate: jest
      .fn(() => {
        return {
          populate: jest.fn(),
          exec: jest.fn(),
        };
      })
      .mockReturnThis(),
    exec: jest.fn(),
  })),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn(),
};

const mockStudentModel = {
  findById: jest.fn(),
};

const mockCourseModel = {
  findById: jest.fn(),
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

  // describe('create', () => {
  //   it('should create a result', async () => {
  //     const mockResult = {
  //       student: 'someStudentId',
  //       course: 'someCourseId',
  //       score: 'A',
  //     };
  //
  //     const mockStudent = {
  //       _id: 'someStudentId',
  //     };
  //
  //     const mockCourse = {
  //       _id: 'someCourseId',
  //     };
  //
  //     mockStudentModel.findById.mockReturnValueOnce(mockStudent);
  //     mockCourseModel.findById.mockReturnValueOnce(mockCourse);
  //     mockResultModel.save.mockReturnValueOnce(mockResult);
  //
  //     const result = await service.create(mockResult);
  //
  //     expect(mockStudentModel.findById).toHaveBeenCalledWith('someStudentId');
  //     expect(mockCourseModel.findById).toHaveBeenCalledWith('someCourseId');
  //     expect(mockResultModel.save).toHaveBeenCalledWith(mockResult);
  //     expect(result).toEqual(mockResult);
  //   });
  //
  //   it('should throw an error if student not found', async () => {
  //     const mockResult = {
  //       student: 'nonExistentStudentId',
  //       course: 'someCourseId',
  //       // other fields
  //     };
  //
  //     mockStudentModel.findById.mockReturnValueOnce(null);
  //
  //     await expect(service.create(mockResult)).rejects.toThrowError(
  //       'Student not found',
  //     );
  //     expect(mockStudentModel.findById).toHaveBeenCalledWith(
  //       'nonExistentStudentId',
  //     );
  //     expect(mockCourseModel.findById).not.toHaveBeenCalled();
  //     expect(mockResultModel.save).not.toHaveBeenCalled();
  //   });
  //
  //   it('should throw an error if course not found', async () => {
  //     const mockResult = {
  //       student: 'someStudentId',
  //       course: 'nonExistentCourseId',
  //       // other fields
  //     };
  //
  //     const mockStudent = {
  //       _id: 'someStudentId',
  //       // other fields
  //     };
  //
  //     mockStudentModel.findById.mockReturnValueOnce(mockStudent);
  //     mockCourseModel.findById.mockReturnValueOnce(null);
  //
  //     await expect(service.create(mockResult)).rejects.toThrowError(
  //       'Course not found',
  //     );
  //     expect(mockStudentModel.findById).toHaveBeenCalledWith('someStudentId');
  //     expect(mockCourseModel.findById).toHaveBeenCalledWith(
  //       'nonExistentCourseId',
  //     );
  //     expect(mockResultModel.save).not.toHaveBeenCalled();
  //   });
  // });

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
