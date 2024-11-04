"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const class_validator_1 = require("class-validator");
const data_source_1 = require("../../../data-source");
const auth_entity_1 = require("../entities/auth.entity");
const encrypt_utils_1 = require("../../../core/utils/encrypt.utils");
const enum_1 = require("../../../core/utils/enum");
class AuthRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(auth_entity_1.User);
    }
    async create(itemData) {
        const hashedPassword = await encrypt_utils_1.encrypt.encryptpass(itemData.password);
        const newUser = await this.repository.create({
            ...itemData,
            password: hashedPassword,
            role: itemData.role || enum_1.ROLE.STUDENT // Default role is 'Student
        });
        //Validate new user
        const errors = await (0, class_validator_1.validate)(newUser);
        if (errors.length > 0) {
            return errors;
        }
        const user = await this.repository.save(newUser);
        return user;
    }
    /**
 * @description save user data with validation
 * @param auth user data
 * @returns saved user or validation errors
 */
    async save(auth) {
        const errors = await (0, class_validator_1.validate)(auth);
        if (errors.length > 0) {
            return errors; // Return validation errors if any
        }
        return await this.repository.save(auth);
    }
    /**
     * @description fetch user using user uniquer ID
     * @param Id user uniquer Id
     * @returns User
     */
    async findById(Id) {
        return this.repository.findOne({ where: { id: Id } }) || null;
    }
    async findAll(page = 1, limit = 10, categoryId, search) {
        const query = this.repository.createQueryBuilder('user').leftJoinAndSelect('user.course', 'course');
        if (categoryId) {
            query.andWhere("category.id = :categoryId", { categoryId });
        }
        if (search) {
            query.andWhere("user.username LIKE :search", { search: `%${search}%` });
        }
        query.skip((page - 1) * limit).take(limit);
        const [products, total] = await query.getManyAndCount();
        return [products, total];
    }
    async update(id, updateData) {
        const user = await this.repository.findOne({ where: { id } });
        if (!user)
            return null;
        Object.assign(user, updateData);
        return await this.repository.save(updateData);
    }
}
exports.AuthRepository = AuthRepository;
