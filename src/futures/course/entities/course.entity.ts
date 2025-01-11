import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Module } from "../../modules/entities/module.entity";
import { Enrollment } from "../../enrollment/entities/enrollment.entity";
import { Accessment } from "../../accessment/entities/accessment.entity";
import { Instructor } from "../../instructor/entities/instructor.entity";
import { Expose } from "class-transformer";

@Entity("course")
export class Course {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  @Expose()
  title: string;

  @ManyToMany(() => Instructor, (instructor) => instructor.courses)
  instructors: Instructor[];

  @Column()
  duration: number;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];

  @OneToMany(() => Accessment, (accessment) => accessment.course)
  accessments: Accessment[];

  @Column()
  description: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @Column()
  category: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  CreateAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
