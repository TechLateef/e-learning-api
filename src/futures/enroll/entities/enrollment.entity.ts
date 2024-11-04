import { CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../auth/entities/auth.entity";
import { Course } from "../../course/entities/course.entity";

@Entity('Enrollment')

export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => Course, course => course.enrollments)
    course: Course;
    

    @ManyToOne(() => User, user => user.enrollments)
    student: User;
    

    @CreateDateColumn()
    CreateAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}