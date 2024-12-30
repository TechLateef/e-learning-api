import { Repository } from "typeorm";
import { Instructor } from "../entities/instructor.entity";
import { CreateInstructorDto } from "../dtos/createinstructor.dto";

export class InstructorService {
    constructor( private instructorRepo: Repository<Instructor>) {}


    async createInstructor(details: CreateInstructorDto) {
        try {
          // Ensure the details include a valid User relationship
          const newInstructor = this.instructorRepo.create(details);
    
          // Save the instructor to the database
          const savedInstructor = await this.instructorRepo.save(newInstructor);
    
          return savedInstructor;
        } catch (error) {
          console.error("Error creating instructor:", error);
          throw new Error("Failed to create instructor. Please try again.");
        }
      }
}