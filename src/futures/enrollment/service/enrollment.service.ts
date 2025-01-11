import { Like, Repository } from "typeorm";
import { Enrollment } from "../entities/enrollment.entity";
import {
  EnrollStudentDTO,
  FetchEnrollCourseQueryDTO,
} from "../dtos/enrollment.dto";
import { StudentService } from "../../students/service/student.service";
import { CourseService } from "../../course/service/course.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";

export class EnrollmentService {
  constructor(
    private enrollmentRepo: Repository<Enrollment>,
    private readonly studentService: StudentService,
    private readonly courseService: CourseService
  ) {}

  /**
   * @description enroll Student in new course if the course is available
   * @param details enrollmentDto contains courseId and studentId
   * @param res Express Response
   * @returns
   */
  async enrollStudent(details: EnrollStudentDTO, res: Response) {
    try {
      // Check if the student exists
      const student = await this.studentService.findById(details.studentId);
      if (!student) {
        return jsonResponse(StatusCodes.NOT_FOUND, res, "Student not found");
      }

      // Check if the course exists
      const course = await this.courseService.findById(details.courseId);
      if (!course) {
        return jsonResponse(StatusCodes.NOT_FOUND, res, "Course not found");
      }

      // Check if the course is available
      if (!course.isAvailable) {
        return jsonResponse(
          StatusCodes.BAD_REQUEST,
          res,
          "Course is not available"
        );
      }

      // Check if the student is already enrolled in the course
      const existingEnrollment = await this.enrollmentRepo.findOne({
        where: { student: student, course: course },
      });
      if (existingEnrollment) {
        return jsonResponse(
          StatusCodes.BAD_REQUEST,
          res,
          "Student is already enrolled in this course"
        );
      }

      // Proceed with enrollment if everything is valid
      const enrollment = this.enrollmentRepo.create({
        student: student,
        course: course,
      });
      const savedEnrollment = await this.enrollmentRepo.save(enrollment);
      return savedEnrollment;
    } catch (error) {
      return jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        undefined,
        res,
        `Error processing enrollment: ${error}`
      );
    }
  }

  /**
   * @description Retrieve all enrolled courses for a student
   * @param details Contains page, limit, search, and studentId
   * @param res Express Response
   * @returns An object containing enrolled courses and the total count
   */
  async getStudentEnrolledCourse(
    details: FetchEnrollCourseQueryDTO,
    res: Response
  ) {
    try {
      const { page = 1, limit = 10, search, studentId } = details;

      if (!studentId) {
        return jsonResponse(
          StatusCodes.BAD_REQUEST,
          undefined,
          res,
          "Student ID is required."
        );
      }

      const offset = (page - 1) * limit;

      const query: any = {
        skip: offset,
        take: limit,
        where: { student: { id: studentId } }, // Filter by studentId
        relations: ["course"], // Eager-load course details
      };

      if (search) {
        query.where.course = { title: Like(`%${search}%`) };
      }

      const [data, total] = await this.enrollmentRepo.findAndCount(query);

      return { data, total };
    } catch (error) {
      return jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        undefined,
        res,
        `Error fetching student enrolled courses: ${error}`
      );
    }
  }
}
