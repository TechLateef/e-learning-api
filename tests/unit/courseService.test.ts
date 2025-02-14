import { CourseService } from "../../src/futures/course/service/course.service";
import { Course } from "../../src/futures/course/entities/course.entity";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

jest.mock("typeorm", () => ({
  getRepository: jest.fn(),
  Entity: () => {},
  PrimaryGeneratedColumn: () => {},
  PrimaryColumn: () => {},
  ManyToOne: () => {},
  OneToMany: () => {},
  OneToOne: () => {},
  ManyToMany: () => {},
  JoinTable: () => {},
  BeforeInsert: () => {},
  BeforeUpdate: () => {},
  Column: () => {},
  JoinColumn: () => {},
  DeleteDateColumn: () => {},
  Index: () => {},
  CreateDateColumn: () => {},
  UpdateDateColumn: () => {},
}));

describe("CourseService", () => {
  let courseService: CourseService;
  let courseRepo: any;

  beforeEach(() => {
    courseRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([[new Course(), new Course()], 2]), // Fix
      })),
    };

    courseService = new CourseService(courseRepo);
  });

  describe("addCourse", () => {
    it("should add a new course", async () => {
      const courseDetails = {
        title: "Introduction to Programming",
        description: "Learn the basics of programming",
        duration: 10,
        category: "tech",
      };

      const course = new Course();
      courseRepo.create.mockReturnValue(course);
      courseRepo.save.mockResolvedValue(course);

      const result = await courseService.addCourse(courseDetails, {} as any);
      expect(result).toEqual(course);
    });

    it("should return error message if course creation fails", async () => {
      const courseDetails = {
        title: "Introduction to Programming",
        description: "Learn the basics of programming",
        duration: 10,
        category: "tech",
      };

      courseRepo.create.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        courseService.addCourse(courseDetails, {} as any)
      ).rejects.toThrow();
    });
  });

  describe("findById", () => {
    it("should find a course by id", async () => {
      const courseId = "123";
      const course = new Course();
      courseRepo.findOne.mockResolvedValue(course);

      const result = await courseService.findById(courseId);
      expect(result).toEqual(course);
    });

    it("should return null if course is not found", async () => {
      const courseId = "123";
      courseRepo.findOne.mockResolvedValue(null);

      const result = await courseService.findById(courseId);
      expect(result).toBeNull();
    });
  });

  describe("fetchAllCourse", () => {
    it("should fetch all courses", async () => {
      const details = {
        page: 1,
        limit: 10,
        search: "programming",
        category: "tech",
        level: "beginner",
        available: true,
      };

      const courses = [new Course(), new Course()];


      const result = await courseService.fetchAllCourse(details, {} as any);
      expect(result).toEqual({ data: courses, total: 2 });
    });
  });
});
