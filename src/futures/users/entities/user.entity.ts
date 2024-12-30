import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    BeforeInsert,
    BeforeUpdate,
} from "typeorm";
import { Exclude } from "class-transformer";
import { ROLE } from "../../../core/utils/enums";
import { Accessment } from "../../accessment/entities/accessment.entity";
import { Instructor } from "../../instructor/entities/instructor.entity";
import { Student } from "../../students/entities/student.entity";
import * as bcrypt from 'bcryptjs';
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    @Column({ type: "enum", enum: ROLE })
    role: ROLE;

    @OneToOne(() => Instructor, (instructor) => instructor.user)
    instructor: Instructor;

    @OneToOne(() => Student, (student) => student.user)
    student: Student;

    @CreateDateColumn()
    accountCreateAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    // Fields for 2FA
    @Column({ nullable: true })
    @Exclude()
    twoFactorSecret: string;

    @Column({ default: false })
    twoFactorEnabled: boolean;

    @Column({ nullable: true })
    passwordResetToken: string;

    @Column({ nullable: true })
    resetTokenExpiresAt: number;

    @OneToMany(() => Accessment, (accessment) => accessment.user)
    accessments: Accessment[];

    /**
     * Encrypt The Password before saving it to the database
     */

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hashSync(this.password, salt);
        }
    }

}

