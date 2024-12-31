import { StatusCodes } from "http-status-codes";
import jsonResponse from "../../../core/utils/lib";
import { InstructorService } from "../../instructor/service/instructor.service";
import { StudentService } from "../../students/service/student.service";
import { CreateUserDto } from "../../users/dtos/createUser.dto";
import { User } from "../../users/entities/user.entity";
import { UserService } from "../../users/service/service.user";
import { Request, Response } from "express";
import { LoginDTO, ResetPasswordDTO } from "../dto/auth.dto";
import { encrypt } from "../../../core/utils/encrypt.utils";
import { Snowflake } from "@theinternetfolks/snowflake";
import { generate } from "otp-generator";
import { EmailService } from "../../email/email.service";

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
                expires: new Date(Date.now() + 1 * 24 * 60 * 60),
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
            const { role } = details;
            const user = await this.userService.createUser(details, res);
            const newUser = user as User
            if (role === 'Student') {
                await this.studentService.createStudent({ user: newUser })
            } else if (role === 'Instructor') {
                await this.instructorService.createInstructor({ user: newUser })
            }
            return jsonResponse(StatusCodes.OK, user, res, 'User created successfully');
        } catch (error) {
            console.error(error);
            jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res);
        }


    }

    /**
     * @description this function give allow user to login
     * @param details loginDTO
     * @param res Express Response
     * @returns 
     */
    async login(details: LoginDTO, res: Response) {
        try {
            const isUser = await this.userService.getUserByEmail(details.email);

            if (!isUser) {
                jsonResponse(StatusCodes.NOT_FOUND, '', res, 'Invalid email or password');
                return
            }

            const isPassword = await encrypt.comparedata(isUser.password, details.password);

            if (!isPassword) {
                jsonResponse(StatusCodes.NOT_FOUND, '', res, 'Invalid email or password');
                return;
            }
            const token = await this.createAndSendToken(isUser, res);
            const data = { token, isUser }
            jsonResponse(StatusCodes.OK, data, res);
        } catch (error) {
            console.error(error)
            jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error: ${error}`)
        }
    }


    /**
     * @description this function send otp via user email
     * @dev opt is been hashed on the entity level
     * @param email string user email
     * @param res Express response
     * @returns void
     */
    async forgetPassword(email: string, res: Response): Promise<void> {
        try {
            const user = await this.userService.getUserByEmail(email);
            const genericMessage = 'If an account with this email exists, an OTP has been sent to your email.';

            // Generic response for non-existent email
            if (!user) {
                return jsonResponse(StatusCodes.OK, null, res, genericMessage);
            }

            // Generate OTP and expiry
            const otp = generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false });

            const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

            // Update user with OTP
            await this.userService.updateUser(user, { passwordResetOTP: otp, otpExpiresAt });

            // Send email
            await new EmailService(user, '', '', otp).sendPasswordReset();

            return jsonResponse(StatusCodes.OK, null, res, genericMessage);
        } catch (error) {
            console.error('Error in forgetPassword:', error);
            return jsonResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                null,
                res,
                'An error occurred while processing your request. Please try again later.'
            );
        }
    }

    /**
     * @description Updates the user password using the provided OTP and new password.
     * @param details ResetPasswordDTO - Contains OTP and newPassword.
     * @param res Express Response
     * @returns void
     */
    async resetpassword(details: ResetPasswordDTO, res: Response): Promise<void> {
        try {
            const { OTP, newPassword } = details;

            // Find user by OTP
            const hashedOtp = await encrypt.encryptdata(OTP); // Ensure encryptdata properly hashes OTP
            const user = await this.userService.findUserByOTP(hashedOtp);

            // Validate user and OTP expiry
            const currentTime = new Date();
            if (!user || currentTime > user.otpExpiresAt!) {
                jsonResponse(StatusCodes.NOT_FOUND, '', res, 'Invalid OTP or OTP has expired');
                return;
            }

            // Update user data
            await this.userService.updateUser(user, {
                otp: null,
                otpExpiresAt: null,
                password: newPassword // Will be hashed by @BeforeUpdate hook in User entity
            });

            // Respond with success
            jsonResponse(StatusCodes.OK, '', res, 'Password has been reset successfully');
        } catch (error) {
            // Narrow the error type
            if (error instanceof Error) {
                console.error('Error during password reset:', error.message);
                jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error while updating user password: ${error.message}`);
            } else {
                console.error('Unexpected error:', error);
                jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Unexpected error occurred`);
            }
        }
    }


}