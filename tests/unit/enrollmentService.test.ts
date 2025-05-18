import { EnrollmentService } from "../../src/futures/enrollment/service/enrollment.service";
import { Enrollment } from "../../src/futures/enrollment/entities/enrollment.entity";
import { StudentService } from "../../src/futures/students/service/student.service";
import { CourseService } from "../../src/futures/course/service/course.service";
import { Course } from "../../src/futures/course/entities/course.entity";
import { Student } from "../../src/futures/students/entities/student.entity";
jest.mock("typeorm", () => ({
    getRepository: jest.fn(),
    Entity: () => { },
    PrimaryGeneratedColumn: () => { },
    PrimaryColumn: () => { },
    ManyToOne: () => { },
    OneToMany: () => { },
    OneToOne: () => { },
    ManyToMany: () => { },
    JoinTable: () => { },
    BeforeInsert: () => { },
    BeforeUpdate: () => { },
    Column: () => { },
    JoinColumn: () => { },
    DeleteDateColumn: () => { },
    Index: () => { },
    CreateDateColumn: () => { },
    UpdateDateColumn: () => { },
}));

describe("EnrollmentService", () => {
    let enrollmentService: EnrollmentService;
    let studentService: StudentService;
    let courseService: CourseService;
    let enrollmentRepo: any;

    beforeEach(() => {
        enrollmentRepo = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockReturnValue([[new Enrollment(), new Enrollment()], 2]),
            })),
        };

        studentService = {
            findById: jest.fn().mockResolvedValue(true),
            studentRepo: {
                findOne: jest.fn(),
                save: jest.fn(),
                create: jest.fn(),
                find: jest.fn(),
            },
            createStudent: jest.fn(),
        } as unknown as StudentService;

        courseService = {
            findById: jest.fn().mockResolvedValue(true),
            addCourse: jest.fn(),
            courseRepo: {
                findOne: jest.fn(),
                save: jest.fn(),
                create: jest.fn(),
                find: jest.fn(),
            },
            fetchAllCourse: jest.fn(),
        } as unknown as CourseService;
        enrollmentRepo = {
            findOne: jest.fn(),
        };

        enrollmentService = new EnrollmentService(enrollmentRepo, studentService, courseService);
    });

    describe("enrollStudent", () => {
        it("should enroll a student in a course", async () => {
            const details = { studentId: "1", courseId: "1" };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const student = new Student();
            const course = new Course();
            course.isAvailable = true;

            studentService.findById = jest.fn().mockResolvedValue(student);
            courseService.findById = jest.fn().mockResolvedValue(course);

            enrollmentRepo.findOne = jest.fn().mockResolvedValue(null);

            const enrollment = new Enrollment();
            enrollmentRepo.create = jest.fn().mockReturnValue(enrollment);
            enrollmentRepo.save = jest.fn().mockResolvedValue(enrollment);

            const result = await enrollmentService.enrollStudent(details, res);

            expect(studentService.findById).toHaveBeenCalledWith(details.studentId);
            expect(courseService.findById).toHaveBeenCalledWith(details.courseId);
            expect(enrollmentRepo.findOne).toHaveBeenCalledWith({
                where: { student: student, course: course },
            });
            expect(enrollmentRepo.create).toHaveBeenCalledWith({
                student: student,
                course: course,
            });
            expect(enrollmentRepo.save).toHaveBeenCalledWith(enrollment);
            expect(result).toEqual(enrollment);
        });

        it("should return NOT_FOUND if the student does not exist", async () => {
            const details = { studentId: "1", courseId: "1" };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            studentService.findById = jest.fn().mockResolvedValue(null);

            await enrollmentService.enrollStudent(details, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                code: 404,
                status: "error",
                message: "Student not found",
            });
        });

        it("should return NOT_FOUND if the course does not exist", async () => {
            const details = { studentId: "1", courseId: "1" };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            studentService.findById = jest.fn().mockResolvedValue(new Student());
            courseService.findById = jest.fn().mockResolvedValue(null);

            await enrollmentService.enrollStudent(details, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                code: 404,
                status: "error",
                message: "Course not found",
            });
        });

        it("should return BAD_REQUEST if the course is not available", async () => {
            const details = { studentId: "1", courseId: "1" };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const student = new Student();
            const course = new Course();
            course.isAvailable = false;

            studentService.findById = jest.fn().mockResolvedValue(student);
            courseService.findById = jest.fn().mockResolvedValue(course);

            await enrollmentService.enrollStudent(details, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: 400,
                status: "error",
                message: "Course is not available",
            });
        });

        it("should return BAD_REQUEST if the student is already enrolled", async () => {
            const details = { studentId: "1", courseId: "1" };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const student = new Student();
            const course = new Course();
            course.isAvailable = true;

            studentService.findById = jest.fn().mockResolvedValue(student);
            courseService.findById = jest.fn().mockResolvedValue(course);
            enrollmentRepo.findOne = jest.fn().mockResolvedValue(new Enrollment());

            await enrollmentService.enrollStudent(details, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: 400,
                status: "error",
                message: "Student is already enrolled in this course",
            });
        });

        it("should handle errors gracefully", async () => {
            const details = { studentId: "1", courseId: "1" };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            studentService.findById = jest.fn().mockRejectedValue(new Error("Database error"));

            await enrollmentService.enrollStudent(details, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                code: 500,
                status: "error",
                message: "Error processing enrollment: Error: Database error",
            });
        });
    });
});