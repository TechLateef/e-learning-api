import { Repository } from "typeorm";
import { Student } from "../entities/student.entity";
import { CreateStudentDto } from "../dtos/createStudent.dto";

export class StudentService {
  constructor(private studentRepo: Repository<Student>) {}

  async createStudent(details: CreateStudentDto) {
    try {
      const newStudent = this.studentRepo.create(details);
      const savedStudent = await this.studentRepo.save(newStudent);
      return savedStudent;
    } catch (error) {
      console.error("Error creating student:", error);
      throw new Error("Failed to create student. Please try again.");
    }
  }

  /**
   * @description fetch student using student id
   * @param studentId string student uniquer Id
   * @returns 
   */
  async findById(studentId: string) {
    return await this.studentRepo.findOne({ where: { id: studentId } });
  }
}
