import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ACCESSMENT_TYPES } from "../../../core/utils/enums";
import { Course } from "../../course/entities/course.entity";
import { User } from "../../auth/entities/auth.entity";

@Entity('accessment')

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

    @ManyToOne(() => User, user => user.accessments)
    user: User;

    @ManyToOne(() => User, user => user.student_accessment)
    instructor: User
}