import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getModelToken } from '@nestjs/mongoose';
import { Course, CourseDocument } from './course.entity';
import { Result, ResultDocument } from '../result/result.entity';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('CourseService', () => {
  let service: CourseService;
  let courseModel: Model<CourseDocument>;
  let resultModel: Model<ResultDocument>;

  const mockCourseModel = function () {};
  mockCourseModel.findOne = jest.fn();
  mockCourseModel.prototype.save = jest.fn();
  mockCourseModel.findByIdAndDelete = jest.fn();
  mockCourseModel.find = jest.fn();

  const mockResultModel = {
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getModelToken(Course.name),
          useValue: mockCourseModel,
        },
        {
          provide: getModelToken(Result.name),
          useValue: mockResultModel,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    courseModel = module.get<Model<CourseDocument>>(getModelToken(Course.name));
    resultModel = module.get<Model<ResultDocument>>(getModelToken(Result.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const course: Course = {
        courseName: 'Math',
      };

      mockCourseModel.findOne.mockResolvedValue(null);
      mockCourseModel.prototype.save.mockResolvedValue(course);

      const result = await service.create(course);

      expect(result).toEqual(course);
      expect(mockCourseModel.findOne).toHaveBeenCalledWith({
        courseName: { $regex: new RegExp('^' + course.courseName + '$', 'i') },
      });
      expect(mockCourseModel.prototype.save).toHaveBeenCalled();
    });

    it('should throw an error if the course already exists', async () => {
      const course: Course = {
        courseName: 'Math',
      };

      mockCourseModel.findOne.mockResolvedValue(course);

      try {
        await service.create(course);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Course already exists');
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result: Course[] = [
        {
          courseName: 'Math',
        },
      ];

      mockCourseModel.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(courseModel.find).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a course', async () => {
      const id = '1';

      jest.spyOn(resultModel, 'deleteMany').mockResolvedValue(null);
      jest.spyOn(courseModel, 'findByIdAndDelete').mockResolvedValue(null);

      expect(await service.delete(id)).toBe(true);
      expect(resultModel.deleteMany).toHaveBeenCalledWith({ course: id });
      expect(courseModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
