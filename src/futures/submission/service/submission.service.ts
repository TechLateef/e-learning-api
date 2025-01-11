import { Repository } from "typeorm";
import { Submission } from "../entities/submission.entity";
import {
  GradeSubmissionDto,
  SubmitAccessmentDto,
} from "../dtos/submission.dto";
import { Response } from "express";
import { AccessmentService } from "../../accessment/service/accessment.service";
import { StudentService } from "../../students/service/student.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";
export class SubmissionService {
  constructor(
    private submissionRepo: Repository<Submission>,
    private readonly accessmentService: AccessmentService,
    private readonly studentService: StudentService
  ) {}

  /**
   * @description Submit Accessment
   * @param details submission data e.g submissionContent, fileUrl
   * @param res Express Response
   * @returns
   */
  async SubmitAccessment(details: SubmitAccessmentDto, res: Response) {
    try {
      //Retrieve Accessment and student using their id the we create submision
      const { accementId, studentId, submissionContent, fileUrl } = details;
      const accessment = await this.accessmentService.findById(accementId);
      const student = await this.studentService.findById(studentId);

      if (!accessment) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          undefined,
          res,
          "Accessment not found"
        );
        return;
      }
      if (!accessment.course.isAvailable) {
        jsonResponse(StatusCodes.NOT_FOUND, "", res, "Course not available");
        return;
      }
      if (!student) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          undefined,
          res,
          "Student not found"
        );
        return;
      }

      const newSubmission = this.submissionRepo.create({
        student,
        accessment,
        submissionContent,
        fileUrl,
      });
      const savedSubmission = await this.submissionRepo.save(newSubmission);
      return savedSubmission;
    } catch (error) {
      jsonResponse(
        StatusCodes.OK,
        undefined,
        res,
        `Error submiting accessment: ${error}`
      );
    }
  }

  /**
   * @description retrieve Submission by it id
   * @param submissionId string
   * @returns
   */
  async getById(submissionId: string) {
    const submision = await this.submissionRepo.findOne({
      where: { id: submissionId },
    });
    return submision;
  }

  /**
   *
   * @param details GradingDetails e.g grade and instructor feedBack
   * @param res
   * @returns
   */
  async gradeAccessment(details: GradeSubmissionDto, res: Response) {
    //Retrieve Submission by its id and make sure only instructor that created this can grade it
    // my plan fetch submission using it Id and relation accessment and check accessment.instructor.id if its same with person calling this endpoint we allow the update
    // if not same we throe UnAuthorize error

    try {
      const { submissionId, instructorId, grade, feedBack } = details;
      // Fetch the submission with its related assessment and instructor
      const submision = await this.submissionRepo
        .createQueryBuilder("submission")
        .leftJoinAndSelect("submission.accessment", "accessment")
        .leftJoinAndSelect("accessment.instructor", "instructor")
        .where("submission.id = :submissionId", { submissionId })
        .andWhere("instructor.id = :instructorId", { instructorId })
        .getOne();
      if (!submision) {
        jsonResponse(
          StatusCodes.UNAUTHORIZED,
          undefined,
          res,
          "Unauthorized or submission not found"
        );
        return;
      }

      submision.grade = grade;
      submision.feedback = feedBack;

      return await this.submissionRepo.save(submision);
    } catch (error) {
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        undefined,
        res,
        `Error grading submission: ${error}`
      );
    }
  }
}
