import { Repository } from "typeorm";
import { Course } from "../entities/course.entity";
import { CreateCourseDTO, FetchCourseQueryDTO } from "../dtos/course.dto";
import { Response } from "express";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";
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
      const newCourse = await this.courseRepo.create({ ...details });
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
   * @description fetch all course can use to filter and search using page, limit, search category and more
   * @param details contains page number, limit, search etc
   * @param res Express response
   * @returns
   */
  async fetchAllCourse(details: FetchCourseQueryDTO, res: Response) {
    try {
      const { page, limit, search, category, level, available } = details;

      // Calculate the offset for pagination
      const offset = (page - 1) * limit;

      // Build the query with optional search and filters
      const query: any = {
        skip: offset,
        take: limit,
        where: {},
      };

      // Add search condition if provided
      if (search) {
        query.where.title = { $like: `%${search}%` };
      }

      // Add category filter if provided
      if (category) {
        query.where.category = category;
      }

      // Add level filter if provided
      if (level) {
        query.where.level = level;
      }

      // Add availability filter if provided
      if (available !== undefined) {
        query.where.available = available;
      }

      // Perform the query with search and filters
      const [data, total] = await this.courseRepo.findAndCount(query);

      // Return the response

      return { data, total };
    } catch (error) {
      return jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        undefined,
        res,
        `Error fetching course: ${error}`
      );
    }
  }
}
