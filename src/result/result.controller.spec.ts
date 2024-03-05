import { Test, TestingModule } from '@nestjs/testing';
import { ResultService } from './result.service';
import { getModelToken } from '@nestjs/mongoose';
import { Result, ResultSchema, Score } from './result.entity';
import { StudentSchema } from '../students/student.entity';
import { CourseSchema } from '../course/course.entity';

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

describe('ResultService', () => {
  let service: ResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of results', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockResults);

      expect(await service.findAll()).toBe(mockResults);
    });
  });

  describe('create', () => {
    it('should create a result', async () => {
      const result: Result = {
        student: student,
        course: course,
        score: Score.A,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await service.create(result)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a result', async () => {
      const id = '1';
      jest.spyOn(service, 'delete').mockResolvedValue(true);

      expect(await service.delete(id)).toBe(true);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
