import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../auth/entities/auth.entity";
import { Module } from "../../modules/entities/module.entity";
import { Enrollment } from "../../enroll/entities/enrollment.entity";
import { Accessment } from "../../accessment/entities/accessment.entity";


@Entity('course')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, user => user.courses)
    instructors: User[]

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