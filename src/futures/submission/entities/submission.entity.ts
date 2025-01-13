import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Student } from "../../students/entities/student.entity";
import { Accessment } from "../../accessment/entities/accessment.entity";

@Entity({ name: 'e_submissions' })
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Accessment, (accessment) => accessment.id, { nullable: false })
  accessment: Accessment;

  @ManyToOne(() => Student, (student) => student.id, { nullable: false })
  student: Student;

  @Column({ nullable: true })
  submissionContent: string; // Could be an answer, text content, or a description of a file.

  @Column({ nullable: true })
  fileUrl: string; // For uploaded files (if applicable).

  @Column({ type: 'float', nullable: true })
  grade: number; // Grade for this specific submission.

  @Column({ nullable: true })
  feedback: string; // Instructor feedback for the submission.

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
