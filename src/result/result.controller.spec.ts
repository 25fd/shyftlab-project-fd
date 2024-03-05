import { Test, TestingModule } from '@nestjs/testing';
import { ResultService } from './result.service';
import { getModelToken } from '@nestjs/mongoose';
import { Result, ResultSchema, Score } from './result.entity';
import { StudentSchema } from '../students/student.entity';
import { CourseSchema } from '../course/course.entity';
import { ResultController } from './result.controller';

const student = {
  _id: 'student1',
  firstName: 'John',
  familyName: 'Doe',
  email: 'a@a.com',
  dateOfBirth: '2002-01-01',
};

const course = { _id: 'course1', courseName: 'Math' };

const mockResults: Result[] = [
  {
    student: student,
    course: course,
    score: Score.A,
  },
];

describe('ResultController', () => {
  let service: ResultService;
  let controller: ResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultController],
      providers: [
        ResultService,
        {
          provide: getModelToken(Result.name),
          useValue: ResultSchema,
        },
        {
          provide: getModelToken('Student'),
          useValue: StudentSchema,
        },
        {
          provide: getModelToken('Course'),
          useValue: CourseSchema,
        },
      ],
    }).compile();

    service = module.get<ResultService>(ResultService);
    controller = module.get<ResultController>(ResultController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of results', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockResults);

      expect(await controller.findAll()).toBe(mockResults);
    });
  });

  describe('create', () => {
    it('should create a result', async () => {
      const result = {
        student: 'student1',
        course: 'course1',
        score: Score.A,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockResults[0]);

      expect(await controller.create(result)).toBe(mockResults[0]);
    });
  });

  describe('delete', () => {
    it('should delete a result', async () => {
      const id = '1';
      jest.spyOn(service, 'delete').mockResolvedValue(true);

      expect(await controller.delete(id)).toBe(true);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
