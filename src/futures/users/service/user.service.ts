import { Any, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/createUser.dto";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";



export class UserService {

    constructor(private userRepository: Repository<User>) { }

    /**
     * @description this function add new user to the database
     * @param details createUserDto
     * @param res Express Response
     * @returns 
     */
    async createUser(details: CreateUserDto, res: Response): Promise<User | void> {
        try {
            const { email } = details;
            const isUser = await this.userRepository.findOne({ where: { email } });

            if (isUser) {
                jsonResponse(StatusCodes.BAD_REQUEST, '', res, `email as already been taken`);
            }

            const newUser = this.userRepository.create({ ...details })

            const savedUser = await this.userRepository.save(newUser);
            return savedUser;
        } catch (error) {
            console.error(error);
            jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error creating user ${error}`);

        }
    }

    /**
     * @description This function fetch user using userId 
     * @param userId string user uniquer Id
     * @returns 
     */
    async getUserById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        return user as User;
    }

    /**
    * @description This function fetch user using email 
    * @param email string user email
    * @returns 
    */
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } })
        return user as User;
    }


    /**
     * @description this function return all users
     * @param page number page Number
     * @param limit number number of item to return per page
     * @param res Express Response
     * @returns 
     */
    async fetchAllUser(page: number, limit: number, res: Response) {
        const offset = (page - 1) * limit;

        const [datas, total] = await this.userRepository.findAndCount({
            skip: offset,
            take: limit
        })

        return {
            data: datas,
            page,
            totalPage: Math.ceil(total / limit),
            totalItems: total

        }
    }



    /**
     * @description This function fetches the user using either OTP or Password Reset OTP.
     * @param otp string user one-time password or password reset OTP.
     * @returns User or null
     */
    async findUserByOTP(otp: string) {
        const isUser = await this.userRepository.findOne({
            where: [
                { otp },                  // Check by otp field
                { passwordResetOTP: otp } // Or check by passwordResetOtp field
            ]
        });
        return isUser;
    }


    /**
     * @description this function update user information
     * @param user user entity
     * @param updateData update data
     * @returns 
     */
    async updateUser(user: User, updateData: Partial<User>): Promise<User> {
        // Merge the new data into the existing user entity
        const updatedUser = this.userRepository.merge(user, updateData);

        // Save the updated user entity
        return await this.userRepository.save(updatedUser);
    }

}