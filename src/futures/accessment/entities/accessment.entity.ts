import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ACCESSMENT_TYPES } from "../../../core/utils/enums";
import { Course } from "../../course/entities/course.entity";
import { Instructor } from "../../instructor/entities/instructor.entity";
import { Student } from "../../students/entities/student.entity";
import { Submission } from "../../submission/entities/submission.entity";

@Entity({ name: 'accessments' })
export class Accessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ACCESSMENT_TYPES })
  accessmentType: ACCESSMENT_TYPES; // E.g., TEST, EXAM, ASSIGNMENT

  @Column()
  title: string; // Title of the assessment

  @Column({ nullable: true })
  description: string; // Description or instructions for the assessment

  @Column({ nullable: true })
  maxGrade: number; // Maximum possible grade for this assessment

  @ManyToOne(() => Course, (course) => course.accessments, { nullable: false })
  course: Course;

  @ManyToOne(() => Instructor, (instructor) => instructor.studentAccessments, { nullable: false })
  instructor: Instructor;

  // One assessment can have multiple submissions (one per student or multiple attempts per student)
  @OneToMany(() => Submission, (submission) => submission.accessment)
  submissions: Submission[];
}
