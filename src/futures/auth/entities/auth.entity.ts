import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ROLE } from "../../../core/utils/enums";
import { Course } from "../../course/entities/course.entity";
import { Enrollment } from "../../enroll/entities/enrollment.entity";
import { Accessment } from "../../accessment/entities/accessment.entity";


@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

    @ManyToMany(() => Course, course => course.instructors)
    @JoinTable() 
    courses: Course[];

    @Column()
    role: ROLE

    @OneToMany(() => Enrollment, enrollment => enrollment.student)
    enrollments: Enrollment[];

    @Column({ nullable: true })
    resetTokenExpiresAt: number;

    @CreateDateColumn()
    accountCreateAt: Date;

    @OneToMany(()=> Accessment, accessment => accessment.user)
    accessments: Accessment[]

    @OneToMany(()=> Accessment, accessment => accessment.instructor)
    student_accessment: Accessment[]

    @UpdateDateColumn()
    updateAt: Date;

    // Fields for 2FA
    @Column({ nullable: true })
    @Exclude()
    twoFactorSecret: string;

    @Column({ default: false })
    twoFactorEnabled: boolean;

    @Column({ nullable: true })
    passwordResetToken: string
}