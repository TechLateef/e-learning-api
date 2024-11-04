import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Course } from "../../course/entities/course.entity";


@Entity('module')

export class Module{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> Course, course => course.modules)
    course: Course

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    order: number;

    @Column()
    content_url: string;

    @Column()
    video_url: string;

    @Column({default: true})
    is_active: boolean;

    @CreateDateColumn()
    CreateAt: Date;

    @UpdateDateColumn()
    updateAt: Date;


}


