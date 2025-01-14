import { Like, Repository } from "typeorm";
import { Course } from "../entities/course.entity";
import { CreateCourseDTO, FetchCourseQueryDTO } from "../dtos/course.dto";
import { Response } from "express";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";
import { randomUUID } from "crypto";
export class CourseService {
  constructor(private courseRepo: Repository<Course>) {}

  /**
   * @description create new course
   * @param details Create Course DTO contain title descript
   * @param res Express Response
   * @returns
   */
  async addCourse(details: CreateCourseDTO, res: Response) {
    try {
      const id = randomUUID();
      const newCourse = this.courseRepo.create({ ...details, id });
      const savedCourse = await this.courseRepo.save(newCourse);
      return savedCourse;
    } catch (error) {
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error: ${error}`
      );
    }
  }

  /**
   * @description get course by Id
   * @param courseId string course Id
   * @param res Express Response
   * @returns
   */
  async findById(courseId: string): Promise<Course | null> {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    return course;
  }
  /**
   * 
   * @description fetch all course can use to filter and search using page, limit, search category and more
   * @param details contains page number, limit, search etc
   * @param res Express response
   * @returns
   */
  async fetchAllCourse(details: FetchCourseQueryDTO, res: Response) {
    try {
      const { page, limit, search, category, level, available } = details;

      // Calculate pagination offset
      const offset = (page - 1) * limit;

      // Start building the query
      const query = this.courseRepo
        .createQueryBuilder("course")
        .skip(offset)
        .take(limit);

      // Add search condition if provided
      if (search) {
        query.andWhere("course.title LIKE :search", { search: `%${search}%` });
      }

      // Add category filter if provided
      if (category) {
        query.andWhere("course.category = :category", { category });
      }

      // Add level filter if provided
      if (level) {
        query.andWhere("course.level = :level", { level });
      }

      // Add availability filter if provided
      if (available !== undefined) {
        query.andWhere("course.isAvailable = :available", { available });
      }

      // Execute query and count total
      const [data, total] = await query.getManyAndCount();

      // Return the response
      return { data, total };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        undefined,
        res,
        `Error fetching course: ${error}`
      );
    }
  }
}
