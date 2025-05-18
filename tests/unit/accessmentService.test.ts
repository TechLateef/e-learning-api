import { Accessment } from "../../src/futures/accessment/entities/accessment.entity";
import { Course } from "../../src/futures/course/entities/course.entity";
import { CourseService } from "../../src/futures/course/service/course.service";
import { Enrollment } from "../../src/futures/enrollment/entities/enrollment.entity";
import { EnrollmentService } from "../../src/futures/enrollment/service/enrollment.service";
import { Student } from "../../src/futures/students/entities/student.entity";
import { StudentService } from "../../src/futures/students/service/student.service";
import { CreateAccessmentDto } from "../../src/futures/accessment/dtos/accessment.dto";
import {AccessmentService} from "../../src/futures/accessment/service/accessment.service";
import { InstructorService } from "../../src/futures/instructor/service/instructor.service";
import { access } from "fs";
import { Instructor } from "../../src/futures/instructor/entities/instructor.entity";
import { ACCESSMENT_TYPES } from "../../src/core/utils/enums";

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

describe("AccessmentService", () => {
    let accessmentService: AccessmentService;
    let instructorService: InstructorService;
    let courseService: CourseService;
    let accessmentRepo: any;

    beforeEach(() => {
        accessmentRepo = {
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
        instructorService = {
            findById: jest.fn(),
            instructorRepo: {
                findOne: jest.fn(),
                save: jest.fn(),
                create: jest.fn(),
                find: jest.fn(),
            },
            createInstructor: jest.fn(),
        } as unknown as InstructorService;
        courseService = {
            findById: jest.fn().mockResolvedValue(true),
            addCourse: jest.fn(),
            courseRepo: {
                findOne: jest.fn(),
                save: jest.fn(),
                create: jest.fn(),
                find: jest.fn(),
            },
        } as unknown as CourseService;
        accessmentService = new AccessmentService(
            accessmentRepo,
            courseService,
            instructorService
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    }
    );
    it("should be defined", () => {
        expect(accessmentService).toBeDefined();
    }
    );
    it("should create new  accessment", async () => {
        const details = {
            instructorId: "student-id",
            courseId: "course-id",
            accessmentType: ACCESSMENT_TYPES.ASSIGNMENT,
            maxGrade: 100,
            title: "course",
            description: "course",
        } ;
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const instructor = new Instructor();
        const course = new Course();
        course.isAvailable = true;
        accessmentRepo.findOne.mockResolvedValue(null);
       ( instructorService.findById as jest.Mock).mockResolvedValue(instructor);
        (courseService.findById as jest.Mock).mockResolvedValue(course);
        accessmentRepo.create.mockReturnValue(new Enrollment());
        accessmentRepo.save.mockResolvedValue(new Enrollment());

        await accessmentService.createAccessment(details, res);

        expect(instructorService.findById).toHaveBeenCalledWith(details.instructorId);
        expect(courseService.findById).toHaveBeenCalledWith(details.courseId);
        // expect(accessmentRepo.findOne).toHaveBeenCalledWith({
        //     where: { instructor: instructor, course: course },
        // });
        expect(accessmentRepo.create).toHaveBeenCalledWith({
            instructor: instructor,
            course: course,
            accessmentType: ACCESSMENT_TYPES.ASSIGNMENT,
            maxGrade: 100,
            title: "course",
            description: "course",
        });
    }
    );
    it("should not create accessment if instructor is not  found", async () => {
        const details = {
            instructorId: "student-id",
            courseId: "course-id",
            accessmentType: ACCESSMENT_TYPES.ASSIGNMENT,
            maxGrade: 100,
            title: "course",
            description: "course",
        } ;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const instructor = new Instructor();
        const course = new Course();
        course.isAvailable = true;
        accessmentRepo.findOne.mockResolvedValue(new Enrollment());
       ( instructorService.findById as jest.Mock).mockResolvedValue(null);
        (courseService.findById as jest.Mock).mockResolvedValue(course);

        await accessmentService.createAccessment(details, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            code: 404,
            status: "error",
            message: "instructor not found",
        });
    });


it("should return NOT_FOUND if the course is not found", async () => {
    const details = {
        instructorId: "student-id",
        courseId: "course-id",
        accessmentType: ACCESSMENT_TYPES.ASSIGNMENT,
        maxGrade: 100,
        title: "course",
        description: "course",          
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as any;

    const instructor = new Instructor();
    const course = new Course();
    course.isAvailable = false;

    instructorService.findById = jest.fn().mockResolvedValue(instructor);
    courseService.findById = jest.fn().mockResolvedValue(null);
    accessmentRepo.findOne = jest.fn().mockResolvedValue(null);

    await accessmentService.createAccessment(details, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
        code: 404,
        status: "error",
        message: "Course not found",
    });
});

});

