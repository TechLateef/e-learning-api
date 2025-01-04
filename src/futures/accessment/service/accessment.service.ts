import { Repository } from "typeorm";
import { Accessment } from "../entities/accessment.entity";
import { CreateAccessmentDto } from "../dtos/accessment.dto";
import { Response } from "express";
import { CourseService } from "../../course/service/course.service";
import { InstructorService } from "../../instructor/service/instructor.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";

export class AccessmentService {
  constructor(
    private accessmentRepo: Repository<Accessment>,
    private readonly courseService: CourseService,
    private readonly instructorService: InstructorService
  ) {}

  /**
   * @description Create new Accessment
   * @param details Accessment Dto E.g title, maxGrade etc
   * @param res Express Response
   * @returns
   */
  async createAccessment(
    details: CreateAccessmentDto,
    res: Response
  ): Promise<Accessment | void> {
    try {
      //fetch course it must exist and active then we fetch instructor by id too who will be adding the course
      const {
        intsructorId,
        courseId,
        accessmentType,
        maxGrade,
        title,
        description,
      } = details;
      const course = await this.courseService.findById(courseId);
      const instructor = await this.instructorService.findById(intsructorId);

      if (!course) {
        jsonResponse(StatusCodes.NOT_FOUND, undefined, res, `Course not found`);
        return;
      }

      if (!instructor) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          undefined,
          res,
          `instructor not found`
        );
        return;
      }
      if (!course.isAvailable) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          undefined,
          res,
          `Course is not available`
        );
        return;
      }

      const newAccessment = this.accessmentRepo.create({
        title,
        maxGrade,
        accessmentType,
        description,
        course,
        instructor,
      });
      const savedAccessment = await this.accessmentRepo.save(newAccessment);

      return savedAccessment;
    } catch (error) {
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        undefined,
        res,
        `Error: ${error}`
      );
    }
  }

  /**
   * @description fetch Accessment using Id
   * @param accessmentId string accessment Id
   * @returns Accessment | null
   */
  async findById(accessmentId: string): Promise<Accessment | null> {
    const accessment = await this.accessmentRepo.findOne({
      where: { id: accessmentId },
    });
    return accessment;
  }
}
