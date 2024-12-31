import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ACCESSMENT_TYPES } from "../../../core/utils/enums";
import { Course } from "../../course/entities/course.entity";
import { Instructor } from "../../instructor/entities/instructor.entity";
import { Student } from "../../students/entities/student.entity";

@Entity({ name:'access_accessment'})

export class Accessment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accessment_type: ACCESSMENT_TYPES;

    @Column()
    description: string;

    @Column()
    grade: number;

    @Column()
    feedback: string;

    @ManyToOne(() => Course, course => course.accessments)
    course: Course

    @ManyToOne(() => Student, Student => Student.user)
    student: Student;

    @ManyToOne(() => Instructor, instructor => instructor.studentAccessments)
    instructor: Instructor
}