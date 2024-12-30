import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
    Column,
    DeleteDateColumn,
  } from "typeorm";
  import { Course } from "../../course/entities/course.entity";
  import { Student } from "../../students/entities/student.entity";
  
  @Entity('Enrollment')
  @Index(["student", "course"], { unique: true }) // Ensures unique enrollment per student-course pair
  export class Enrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Course, (course) => course.enrollments, { eager: true })
    course: Course;
  
    @ManyToOne(() => Student, (student) => student.enrollments, { eager: true })
    student: Student;
  
    @Column({ type: 'enum', enum: ['active', 'canceled', 'completed'], default: 'active' })
    status: 'active' | 'canceled' | 'completed';
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date; // Soft delete support
  }
  