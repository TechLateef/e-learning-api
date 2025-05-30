import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { AuthService } from "../../futures/auth/service/auth.service";
import { Instructor } from "../../futures/instructor/entities/instructor.entity";
import { InstructorService } from "../../futures/instructor/service/instructor.service";
import { Student } from "../../futures/students/entities/student.entity";
import { StudentService } from "../../futures/students/service/student.service";
import { User } from "../../futures/users/entities/user.entity";
import { UserService } from "../../futures/users/service/user.service";
import { AccessmentService } from "../../futures/accessment/service/accessment.service";
import { CourseService } from "../../futures/course/service/course.service";
import { Course } from "../../futures/course/entities/course.entity";
import { Accessment } from "../../futures/accessment/entities/accessment.entity";
import { SubmissionService } from "../../futures/submission/service/submission.service";
import { Submission } from "../../futures/submission/entities/submission.entity";
import { EnrollmentService } from "../../futures/enrollment/service/enrollment.service";
import { Enrollment } from "../../futures/enrollment/entities/enrollment.entity";

export class ServiceFactory {
    private static userService: UserService;
    private static instructorService: InstructorService;
    private static studentService: StudentService;
    private static authService: AuthService;
    private static accessmentService: AccessmentService;
    private static courseService: CourseService;
    private static submissionService: SubmissionService;
    private static enrollmentService: EnrollmentService;

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

    // Method to get StudentService
    static getCourseService(): CourseService {
        if (!this.courseService) {
            const courseRepo: Repository<Course> = AppDataSource.getRepository(Course);
            this.courseService = new CourseService(courseRepo);
        }
        return this.courseService;
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
    //Method to get EnrollmentService
    static getEnrollmentService(): EnrollmentService {
        if(!this.enrollmentService) {
            const enrollmentRepo: Repository<Enrollment> = AppDataSource.getRepository(Enrollment);
            const studentService = this.getStudentService()
            const courseService = this.getCourseService()
            this.enrollmentService = new EnrollmentService(enrollmentRepo, studentService, courseService);
        }
        return this.enrollmentService;
    }
    
    // Method to get AccessmnetService
    static getAccessmentService(): AccessmentService {
        if(!this.accessmentService) {
            const accessmentRepo: Repository<Accessment> = AppDataSource.getRepository(Accessment);
            const courseService = this.getCourseService();
            const instructorService = this.getInstructorService();
            this.accessmentService = new AccessmentService(accessmentRepo,courseService, instructorService);
        }
        return this.accessmentService;
    }

    // Method to get SubmissionService
    static getSubmissionService(): SubmissionService {
        if(!this.submissionService) {
            const submissionRepo: Repository<Submission> = AppDataSource.getRepository(Submission);
            const accessmentService = this.getAccessmentService()
            const studentService = this.getStudentService();
            this.submissionService = new SubmissionService(submissionRepo, accessmentService, studentService);
            
        }
        return this.submissionService;
    }
}
