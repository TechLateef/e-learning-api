import { Repository } from "typeorm";
import { Module } from "../entities/module.entity";
import { CreateModuleDto, UpdateModuleDto } from "../dtos/module.dto";
import { Response } from "express";
import { CourseService } from "../../course/service/course.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";

export class ModuleController {
    constructor(private moduleRepo: Repository<Module>, private readonly courseService: CourseService) {}


    /**
     * @description create new module associated to a course 
     * @param details 
     * @param res 
     * @returns 
     */
    async createModule(details: CreateModuleDto, res: Response) {
        try {
            
            const course = await this.courseService.findById(details.courseId);
            if(!course) {
                jsonResponse(StatusCodes.NOT_FOUND, '', res, 'Course not found')
                return;
            }
             if(!course.isAvailable) {
                jsonResponse(StatusCodes.NOT_FOUND, '', res, "Course not available")
                return;
             }
             const newModule = await this.moduleRepo.create({...details, course});

             const savedCourse = await this.moduleRepo.save(newModule);
             return savedCourse;
        } catch (error) {
            jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, undefined, res, `Error adding module: ${error}`)
        }
    }

    /**
     * @description update module title, description and order
     * @param details contain title description and order
     * @param res 
     * @returns 
     */
    async updateModule(details: UpdateModuleDto, res: Response) {
        try {
          // Check if the module exists
          const isModule = await this.moduleRepo.findOne({ where: { id: details.moduleId } });
    
          if (!isModule) {
            return jsonResponse(StatusCodes.NOT_FOUND, null, res, "Module not found.");
          }
    
          // Update the module details
          const updatedModule = await this.moduleRepo.save({
            ...details      });
    
          return jsonResponse(StatusCodes.OK, updatedModule, res, "Module updated successfully.");
        } catch (error) {
          console.error("Error updating module:", error);
          return jsonResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            null,
            res,
            `Error updating module: ${error}`
          );
        }
      }
   
   
}