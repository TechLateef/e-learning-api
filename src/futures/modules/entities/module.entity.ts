import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Course } from "../../course/entities/course.entity";


@Entity('module')

export class Module{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> Course, course => course.modules)
    course: Course

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    order: number;

    @Column()
    contentUrl: string[];

    @Column()
    videoUrl: string[];

    @Column({default: true})
    is_active: boolean;

    @Column({default: false})
    completed: boolean;

    @CreateDateColumn()
    CreateAt: Date;

    @UpdateDateColumn()
    updateAt: Date;


}


