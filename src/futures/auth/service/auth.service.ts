import { StatusCodes } from "http-status-codes";
import jsonResponse from "../../../core/utils/lib";
import { InstructorService } from "../../instructor/service/instructor.service";
import { StudentService } from "../../students/service/student.service";
import { CreateUserDto } from "../../users/dtos/createUser.dto";
import { User } from "../../users/entities/user.entity";
import { UserService } from "../../users/service/service.user";
import { Request, Response } from "express";
import { LoginDTO } from "../dto/auth.dto";
import { encrypt } from "../../../core/utils/encrypt.utils";

export class AuthService {
    constructor(private readonly userService: UserService, private readonly studentService: StudentService, private readonly instructorService: InstructorService) {

    }

    public async createAndSendToken(
        user: User,
        res: Response
    ) {
        try {
        const token = await encrypt.generateToken(user);
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 1 * 24 *60 *60),
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        });
        res.set("authorization", token);
        return token;     
        } catch (error) {
            throw new Error("Error creating and sending token: " + error);
        }
    }
    /**
     * @description this function create new user depending on there role
     * @dev I have handle input validation on the DTO level 
     * so it wont pass through if the role is not included in the known role
     * @param details createUserDTO
     * @param req Express Request
     * @param res Express Response
     * @returns 
     */
    async signUp(details: CreateUserDto, req: Request, res: Response) {
     try {
        const {role} = details;
        const user = await this.userService.createUser(details, res);
        const newUser = user as User
        if(role === 'Student') {
            await this.studentService.createStudent({ user:newUser })
        } else if(role === 'Instructor') {
            await this.instructorService.createInstructor({user: newUser})
        }
        return jsonResponse(StatusCodes.OK, user, res, 'User created successfully');
     } catch (error) {
        console.error(error);
        jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res);
     }

     
    }


    async login(details: LoginDTO, res: Response) {
        try {
            const isUser = await this.userService.getUserByEmail(details.email);

        if(!isUser) {
            jsonResponse(StatusCodes.NOT_FOUND, '', res, 'Invalid email or password');
            return
        }

        const isPassword = await encrypt.comparepassword(isUser.password, details.password);

        if(!isPassword) {
            jsonResponse(StatusCodes.NOT_FOUND, '', res, 'Invalid email or password');
            return;
        }
        const token = await this.createAndSendToken(isUser, res);
        const data ={token, isUser}
        jsonResponse(StatusCodes.OK, data, res);
        } catch (error) {
            console.error(error)
            jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error: ${error}`)
        }
    }
}