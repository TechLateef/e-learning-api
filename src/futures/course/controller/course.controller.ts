import { RequestHandler } from "express";
import { CourseService } from "../service/course.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * @description add new Course
   * @access protected
   * @param req Express Request
   * @param res Express response
   * @param next Express NextFunction
   */
  addCourse: RequestHandler = async (req, res, next) => {
    try {
      const newCourse = await this.courseService.addCourse(req.body, res);
      jsonResponse(StatusCodes.CREATED, newCourse, res);
    } catch (error) {
      console.error(error);
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        undefined,
        res,
        `Error: ${error}`
      );
    }
  };

  /**
   * @description Search and filter course
   * @param req 
   * @param res 
   * @param next 
   */
  fetchCourse: RequestHandler = async (req, res, next) => {
    try {
      const {
        page = "1",
        limit = "10",
        search = "",
        category,
        level,
        available,
      } = req.query;

      const pagination = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };

      const filters = {
        search: search as string,
        category: category as string | undefined,
        level: level as string | undefined,
        available: available === "true", // Convert to boolean
      };

      // Fetch courses from service
      const courses = await this.courseService.fetchAllCourse(
        { ...pagination, ...filters },
        res
      );

      jsonResponse(StatusCodes.OK, courses, res);
    } catch (error) {
      console.error("Error fetching courses:", error);
      next(error); // Pass the error to the global error handler
    }
  };
}
