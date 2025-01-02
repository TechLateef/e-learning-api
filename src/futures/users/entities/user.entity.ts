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
@Entity({ name: 'access_user'})
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

    @Column({ nullable: true })
    otp: string;

    @Column({ nullable: true})
    verified: boolean;

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

    @Column({ nullable: true, default: false})
    twoFactVerified: boolean;

    @Column({ nullable: true })
    otpAscii: string;

    @Column({ nullable: true })
    otpHex: string;

    @Column({ nullable: true })
    otpBase32: string;
    
    @Column({ nullable: true })
    otpAuthUrl: string;

    @Column({ nullable: true })
    passwordResetOTP: string;

    @Column({ nullable: true })
    resetOTPExpiresAt: Date;

    @Column({ nullable: true })
    otpExpiresAt: Date;    

    @OneToMany(() => Accessment, (accessment) => accessment.student)
    accessments: Accessment[];

    /**
     * Encrypt The Password before saving it to the database
     */

    @BeforeInsert()
    @BeforeUpdate()
    async hashPasswordAndOTP() {
        const salt = await bcrypt.genSalt(10);
    
        // Hash password if it's present and not already hashed
        if (this.password && !bcrypt.getRounds(this.password)) {
            this.password = await bcrypt.hash(this.password, salt);
        }
    
        // Hash OTP if it's present and not already hashed
        if (this.otp && !bcrypt.getRounds(this.otp)) {
            this.otp = await bcrypt.hash(this.otp, salt);
        }
    }

}

