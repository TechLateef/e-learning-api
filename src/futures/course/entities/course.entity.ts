import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Module } from "../../modules/entities/module.entity";
import { Enrollment } from "../../enrollment/entities/enrollment.entity";
import { Accessment } from "../../accessment/entities/accessment.entity";
import { Instructor } from "../../instructor/entities/instructor.entity";


@Entity('course')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Instructor, instructor => instructor.courses)
    instructors: Instructor[]

    @Column()
    duration: number;

    @Column({ default: true })
    is_available: boolean;

    @OneToMany(() => Module, module => module.course)
    modules: Module[]
    @OneToMany(() => Accessment, accessment => accessment.course)
    accessments: Accessment[];

    @Column()
    description: string;

    @OneToMany(() => Enrollment, enrollment => enrollment.course)
    enrollments: Enrollment[];


    @Column()
    category: string;

    @CreateDateColumn()
    CreateAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}