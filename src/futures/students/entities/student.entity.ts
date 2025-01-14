import { Entity, OneToMany, JoinColumn, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";
import { Enrollment } from "../../enrollment/entities/enrollment.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: 'e_students'})
export class Student {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete:'CASCADE',onUpdate:'CASCADE', eager: true })
    user: User;


    @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
    @JoinColumn()
    enrollments: Enrollment[];
}
