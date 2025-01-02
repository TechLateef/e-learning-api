// import { validate, ValidationError } from "class-validator";
// import { IRepository } from "../../../core/interface/IRepository";
// import { AppDataSource } from "../../../data-source";
// import { User } from "../../users/entities/user.entity";
// import { encrypt } from "../../../core/utils/encrypt.utils";
// import { CreateUserDto } from "../dto/auth.dto";
// import { Repository } from "typeorm";
// import { ROLE } from "../../../core/utils/enums";
// import { response } from "express";


// export class AuthRepository implements IRepository<User> {

//     private readonly repository: Repository<User>
//     constructor() {
//         this.repository = AppDataSource.getRepository(User)
//     }


//     async create(itemData: Partial<CreateUserDto>): Promise<User | ValidationError[]> {
//         const hashedPassword = await encrypt.encryptpass(itemData.password!)

//         const newUser = await this.repository.create({
//             ...itemData,
//             password: hashedPassword,
//             role: itemData.role || ROLE.STUDENT // Default role is 'Student
//         })
//         //Validate new user
//         const errors = await validate(newUser)
//         if (errors.length > 0) {
//             return errors
//         }

//         const user = await this.repository.save(newUser)

//         return user
//     }

//     /**
//  * @description save user data with validation
//  * @param auth user data
//  * @returns saved user or validation errors
//  */
//     async save(auth: Partial<User>): Promise<User | ValidationError[]> {
//         const errors = await validate(auth);
//         if (errors.length > 0) {
//             return errors; // Return validation errors if any
//         }
//         return await this.repository.save(auth);
//     }

//     /**
//      * @description fetch user using user uniquer ID
//      * @param Id user uniquer Id
//      * @returns User 
//      */
//     async findById(Id: number): Promise<User | null> {
//         return this.repository.findOne({ where: { id: Id } }) || null;
//     }

//     async findAll(page: number = 1, limit: number = 10, categoryId?: number, search?: string): Promise<[User[], number]> {
//         const query = this.repository.createQueryBuilder('user').leftJoinAndSelect('user.course', 'course');

//         if (categoryId) {
//             query.andWhere("category.id = :categoryId", { categoryId });
//         }
//         if (search) {
//             query.andWhere("user.username LIKE :search", { search: `%${search}%` });
//         }

//         query.skip((page - 1) * limit).take(limit);

//         const [products, total] = await query.getManyAndCount();
//         return [products, total];
//     }

//     async update(id: number, updateData: Partial<User>): Promise<User | null> {
//         const user = await this.repository.findOne({ where: { id } })
//         if (!user) return null

//         Object.assign(user, updateData)
//         return await this.repository.save(updateData)
//     }
// }