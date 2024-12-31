import { Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, ManyToOne } from "typeorm";
import { Course } from "../../course/entities/course.entity";
import { Accessment } from "../../accessment/entities/accessment.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: 'access_instructor'})
export class Instructor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, eager: true })
  user: User;

  @ManyToMany(() => Course, (course) => course.instructors)
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Accessment, (accessment) => accessment.instructor)
  studentAccessments: Accessment[];
}
