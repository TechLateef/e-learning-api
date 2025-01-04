import { RequestHandler } from "express";
import { SubmissionService } from "../service/submission.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";

export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  /**
   * @description Submit Accessment
   * @param req Express Resquest
   * @param res Express response
   * @param next Express NextFunction
   */
  submitAccessment: RequestHandler = async (req, res, next) => {
    try {
      const submission = await this.submissionService.SubmitAccessment(
        req.body,
        res
      );
      jsonResponse(StatusCodes.OK, submission, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };



  /**
   * @description Retriev submission by it id
   * @param req Express Request
   * @param res Express response
   * @param next Express NextFuntion
   * @returns 
   */
  findById: RequestHandler = async (req, res, next) => {
    try {
      const submision = await this.submissionService.getById(
        req.params.submisionId
      );
      if (!submision) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          undefined,
          res,
          "Submission not found"
        );
        return;
      }

      jsonResponse(StatusCodes.OK, submision, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description grade accessment and give feedback
   * @param req Express Response
   * @param res Express Response
   * @param next 
   */
  gradeSubmission: RequestHandler = async (req, res, next) => {
    try {
      const gradedSubmission = await this.submissionService.gradeAccessment(
        req.body,
        res
      );

      jsonResponse(StatusCodes.OK, gradedSubmission, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
