import express, { RequestHandler, Router } from "express";
import authenticationMiddleware, {
  authorize,
} from "../../../core/middleware/middleware";
import { ServiceFactory } from "../../../core/factories/service.factory";
import { EnrollementController } from "../controller/enrollment.controller";
import { dtoValidationMiddleware } from "../../../core/middleware/dtoValidationMiddleware";
import { EnrollStudentDTO, FetchEnrollCourseQueryDTO } from "../dtos/enrollment.dto";

const ROUTE ={
    ENROLL: '/',
    GET_ENROLL_COURSE: '/'
}
const enrollmentRoute = Router();

const enrollmentService = ServiceFactory.getEnrollmentService()
const enrollmentController = new EnrollementController(enrollmentService);

enrollmentRoute.use(authenticationMiddleware, authorize("student", "admin"));

/**
 * @route POST /
 * @description enroll student in a course if the course is available
 * @access protected 
 */
enrollmentRoute.post(ROUTE.ENROLL, dtoValidationMiddleware(EnrollStudentDTO), enrollmentController.enroll)




/**
 * @route GET /
 * @description Retriev all enroll course for student 
 * @access protected 
 */
enrollmentRoute.get(ROUTE.GET_ENROLL_COURSE, dtoValidationMiddleware(FetchEnrollCourseQueryDTO),enrollmentController.fetchStudentCourse);
