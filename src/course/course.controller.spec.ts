import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { CourseDto } from './course.dto';
import { Result, ResultSchema } from '../result/result.entity';

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  const mockCourseModel = {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        CourseService,
        {
          provide: getModelToken(Course.name),
          useValue: mockCourseModel,
        },
        {
          provide: getModelToken(Result.name),
          useValue: ResultSchema,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result: Course[] = [
        {
          courseName: 'Math',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const course: CourseDto = {
        courseName: 'Math',
      };

      const createdCourse: Course = {
        courseName: 'Math',
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdCourse);

      expect(await controller.create(course)).toBe(createdCourse);
      expect(service.create).toHaveBeenCalledWith(course);
    });
  });

  describe('delete', () => {
    it('should delete a course', async () => {
      const id = '1';

      jest.spyOn(service, 'delete').mockResolvedValue(true);

      expect(await controller.delete(id)).toBe(true);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
