import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { AuthService } from "../../futures/auth/service/auth.service";
import { Instructor } from "../../futures/instructor/entities/instructor.entity";
import { InstructorService } from "../../futures/instructor/service/instructor.service";
import { Student } from "../../futures/students/entities/student.entity";
import { StudentService } from "../../futures/students/service/student.service";
import { User } from "../../futures/users/entities/user.entity";
import { UserService } from "../../futures/users/service/user.service";

export class ServiceFactory {
    private static userService: UserService;
    private static instructorService: InstructorService;
    private static studentService: StudentService;
    private static authService: AuthService;

    // Method to get UserService
    static getUserService(): UserService {
        if (!this.userService) {
            const userRepository: Repository<User> = AppDataSource.getRepository(User);
            this.userService = new UserService(userRepository);
        }
        return this.userService;
    }

    // Method to get InstructorService
    static getInstructorService(): InstructorService {
        if (!this.instructorService) {
            const instructorRepo: Repository<Instructor> = AppDataSource.getRepository(Instructor);
            this.instructorService = new InstructorService(instructorRepo);
        }
        return this.instructorService;
    }

    // Method to get StudentService
    static getStudentService(): StudentService {
        if (!this.studentService) {
            const studentRepo: Repository<Student> = AppDataSource.getRepository(Student);
            this.studentService = new StudentService(studentRepo);
        }
        return this.studentService;
    }

    // Method to get AuthService
    static getAuthService(): AuthService {
        if (!this.authService) {
            const userService = this.getUserService();
            const studentService = this.getStudentService();
            const instructorService = this.getInstructorService();
            this.authService = new AuthService(userService, studentService, instructorService);
        }
        return this.authService;
    }
}
