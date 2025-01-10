import express, { Router } from "express";
import { ServiceFactory } from "../../../core/factories/service.factory";
import { CourseController } from "../controller/course.controller";
import authenticationMiddleware from "../../../core/middleware/middleware";
import { dtoValidationMiddleware } from "../../../core/middleware/dtoValidationMiddleware";
import { CreateCourseDTO, FetchCourseQueryDTO } from "../dtos/course.dto";


const ROUTE = {
    ADDCOURSE: '/',
    GET_COURSE: '/'
}

const courseRouter = Router()



const courseService = ServiceFactory.getCourseService()
const courseController = new CourseController(courseService);



courseRouter.use(authenticationMiddleware as express.RequestHandler)




/**
 * @route POST `
 * @description Add new Course
 * @access protected
 */
courseRouter.post(ROUTE.ADDCOURSE, dtoValidationMiddleware(CreateCourseDTO), courseController.addCourse)


/**
 * @route GET /
 * @description Retrieve all courses can also query
 * @access public
 */
courseRouter.get(ROUTE.GET_COURSE, dtoValidationMiddleware(FetchCourseQueryDTO), courseController.fetchCourse)