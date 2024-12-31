import { Entity, OneToMany, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Enrollment } from "../../enrollment/entities/enrollment.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: 'access_student'})
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: true })
    user: User;


    @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
    @JoinColumn()
    enrollments: Enrollment[];
}
