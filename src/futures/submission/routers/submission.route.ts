import { Router } from "express";
import express from 'express';
import authenticationMiddleware from "../../../core/middleware/middleware";
import { dtoValidationMiddleware } from "../../../core/middleware/dtoValidationMiddleware";
import { GradeSubmissionDto, SubmitAccessmentDto } from "../dtos/submission.dto";
import { ServiceFactory } from "../../../core/factories/service.factory";
import { SubmissionController } from "../controller/submission.controller";

const ROUTER = {
    SUBMIT_ACCESSMENT : '/',
    GET_SUBMISSION: '/:submissionId',
    GRADE_SUBMISSION: '/grade-submission'
} as const

const submissionService = ServiceFactory.getSubmissionService()

const submissionController = new SubmissionController(submissionService)


const submissionRouter = Router()

submissionRouter.use(authenticationMiddleware )


/**
 * @route POST /
 * @description Submit accessment
 * @access protected
 */

submissionRouter.post(ROUTER.SUBMIT_ACCESSMENT, dtoValidationMiddleware(SubmitAccessmentDto), submissionController.submitAccessment )
/**
 * @route GET /:submissinId
 * @description Retrieve submision by id
 * @access protected
 */

submissionRouter.get(ROUTER.GET_SUBMISSION, submissionController.findById);

/**
 * @route PATCH /grade-submission
 * @description grade submission
 * @access protected
 */

submissionRouter.patch(ROUTER.GRADE_SUBMISSION, dtoValidationMiddleware(GradeSubmissionDto), submissionController.gradeSubmission)