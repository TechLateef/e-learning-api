import { RequestHandler } from "express";
import { EnrollmentService } from "../service/enrollment.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";

export class EnrollementController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  /**
   * @description enroll student in a course
   * @param req
   * @param res
   * @param next
   */
  enroll: RequestHandler = async (req, res, next) => {
    try {
      const newEnrollment = await this.enrollmentService.enrollStudent(
        req.body,
        res
      );
      jsonResponse(StatusCodes.CREATED, newEnrollment, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description fetch all student enroll course 
   * @param req 
   * @param res 
   * @param next 
   */
  fetchStudentCourse: RequestHandler = async (req, res, next) => {
    try {
      const studentId = req.user?.id!;
      const { page = "1", limit = "10", search = "" } = req.query;
      const pagination = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };

      const filters = {
        search: search as string,
      };
      // Fetch courses from service
      const courses = await this.enrollmentService.getStudentEnrolledCourse(
        { ...pagination, ...filters, studentId },
        res
      );
      jsonResponse(
        StatusCodes.OK,
        courses,
        res,
        "Enrolled courses retrieved successfully."
      );
    } catch (error) {
      console.error("Error fetching courses:", error);
      next(error); // Pass the error to the global error handler
    }
  };
}
