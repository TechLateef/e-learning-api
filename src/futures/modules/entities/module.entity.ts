import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Course } from "../../course/entities/course.entity";


@Entity('e_module')

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

    @Column( { type: 'text', array: true, nullable: true })
    contentUrl: string[];

    @Column({ type: 'text', array: true, nullable: true })
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


