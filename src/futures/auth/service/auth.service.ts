import { StatusCodes } from "http-status-codes";
import jsonResponse from "../../../core/utils/lib";
import { InstructorService } from "../../instructor/service/instructor.service";
import { StudentService } from "../../students/service/student.service";
import { CreateUserDto } from "../../users/dtos/createUser.dto";
import { User } from "../../users/entities/user.entity";
import { UserService } from "../../users/service/user.service";
import { Request, Response } from "express";
import {
  GenerateOTPDto,
  GetProfileDto,
  LoginDTO,
  ResetPasswordDTO,
  TwoFAValidationDTO,
  UpdateUserProfileDto,
  VerifyAndEnable2FADto,
} from "../dto/auth.dto";
import { encrypt } from "../../../core/utils/encrypt.utils";
import { Snowflake } from "@theinternetfolks/snowflake";
import { generate } from "otp-generator";
import { EmailService } from "../../email/email.service";
import * as OTPAuth from "otpauth";
import { encode } from "hi-base32";
import crypto, { randomUUID } from "crypto";
import * as jwt from "jsonwebtoken";

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly instructorService: InstructorService
  ) {}

  public async createAndSendToken(user: User, res: Response) {
    try {
      const token = await encrypt.generateToken(user);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
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
   * @dev Also id is generate here to synce userId and student or instructor id depending on which is created
   * @param details createUserDTO
   * @param req Express Request
   * @param res Express Response
   * @returns
   */
  async signUp(details: CreateUserDto, res: Response) {
    try {
      const { role } = details;
      const id = randomUUID();
        details.id = id;
      const user = await this.userService.createUser(details, res);
      const newUser = user as User;
      if (role === "Student") {
        await this.studentService.createStudent({ user: newUser, id });
      } else if (role === "Instructor") {
        await this.instructorService.createInstructor({ user: newUser, id });
      }
      return user;
    } catch (error) {
      console.error(error);
      jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, "", res);
    }
  }

  /**
   * @description this function allows a user to log in
   * @param details LoginDTO
   * @param res Express Response
   * @returns
   */
  async login(details: LoginDTO, res: Response) {
    try {
      const user = await this.userService.getUserByEmail(details.email);
      if (!user) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          "",
          res,
          "Invalid email or password"
        );
        return;
      }

      const isPasswordValid = await encrypt.comparedata(
        user.password,
        details.password
      );
      if (!isPasswordValid) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          "",
          res,
          "Invalid email or password"
        );
        return;
      }

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        // Respond with a temporary token for 2FA
        const tempToken = this.createTemporaryToken(user.id); // Temporary token creation logic
        jsonResponse(StatusCodes.OK, { requires2FA: true, tempToken }, res);
        return;
      }

      // Issue JWT directly for non-2FA users
      const token = await this.createAndSendToken(user, res);
      return { token, user };
    } catch (error) {
      console.error(error);
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error: ${error}`
      );
    }
  }

  /**
   *
   * @param details  -dto it contains userId
   * @param res Express Response
   * @returns void or user data
   */
  async getProfile(details: GetProfileDto, res: Response) {
    try {
      const user = await this.userService.getUserById(details.userId);
      if (!user) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          "",
          res,
          `User with that Id not found`
        );
        return;
      }
      return user;
    } catch (error) {
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error: ${error}`
      );
    }
  }
  /**
   * @description Update user record
   * @param details Contain user info like phone fullname address and more
   * @param userId string user id
   * @param res Express Response
   * @returns
   */
  async updateProfile(
    details: UpdateUserProfileDto,
    userId: string,
    res: Response
  ) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          "",
          res,
          `User with that Id not found`
        );
        return;
      }

      const updatedUser = await this.userService.updateUser(user, details);

      return updatedUser;
    } catch (error) {
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error: ${error}`
      );
    }
  }
  /**
   * Temporary token creation logic
   */
  createTemporaryToken(userId: string) {
    // Implement your temporary token logic, e.g., a short-lived JWT
    return jwt.sign({ userId }, process.env.TEMP_TOKEN_SECRET!, {
      expiresIn: "5m",
    });
  }

  /**
   * @description this function send otp via user email
   * @dev opt is been hashed on the entity level
   * @param email string user email
   * @param res Express response
   * @returns void
   */
  async forgetPassword(email: string, res: Response): Promise<void | string> {
    try {
      const user = await this.userService.getUserByEmail(email);
      const genericMessage =
        "If an account with this email exists, an OTP has been sent to your email.";

      // Generic response for non-existent email
      if (!user) {
        return jsonResponse(StatusCodes.OK, null, res, genericMessage);
      }

      // Generate OTP and expiry
      const otp = generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
      });

      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Update user with OTP
      await this.userService.updateUser(user, {
        passwordResetOTP: otp,
        otpExpiresAt,
      });

      // Send email
      await new EmailService(user, "", "", otp).sendPasswordReset();

      return genericMessage;
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      return jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        res,
        "An error occurred while processing your request. Please try again later."
      );
    }
  }

  /**
   * @description verify user account using provided OTP
   * @param otp string
   * @param res Express Response
   * @returns void
   */

  async verifyAccount(otp: string, res: Response): Promise<string | void> {
    try {
      const hashedOtp = await encrypt.encryptdata(otp);
      const user = await this.userService.findUserByOTP(hashedOtp);
      // Validate user and OTP expiry
      const currentTime = new Date();
      if (!user || currentTime > user.otpExpiresAt!) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          "",
          res,
          "Invalid OTP or OTP has expired"
        );
        return;
      }

      await this.userService.updateUser(user, { verified: true });
      const message = "Account verified ✅ please login";

      return message;
    } catch (error) {
      console.error(error);
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error verifying user account: ${error}`
      );
    }
  }

  /**
   * @description Updates the user password using the provided OTP and new password.
   * @param details ResetPasswordDTO - Contains OTP and newPassword.
   * @param res Express Response
   * @returns void
   */
  async resetpassword(
    details: ResetPasswordDTO,
    res: Response
  ): Promise<void | string> {
    try {
      const { OTP, newPassword } = details;

      // Find user by OTP
      const hashedOtp = await encrypt.encryptdata(OTP);
      const user = await this.userService.findUserByOTP(hashedOtp);

      // Validate user and OTP expiry
      const currentTime = new Date();
      if (!user || currentTime > user.otpExpiresAt!) {
        jsonResponse(
          StatusCodes.NOT_FOUND,
          "",
          res,
          "Invalid OTP or OTP has expired"
        );
        return;
      }

      // Update user data
      await this.userService.updateUser(user, {
        otp: undefined,
        otpExpiresAt: undefined,
        password: newPassword, // Will be hashed by @BeforeUpdate hook in User entity
      });

      // Respond with success
      return "Password has been reset successfully";
    } catch (error) {
      // Narrow the error type
      if (error instanceof Error) {
        console.error("Error during password reset:", error.message);
        jsonResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "",
          res,
          `Error while updating user password: ${error.message}`
        );
      } else {
        console.error("Unexpected error:", error);
        jsonResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "",
          res,
          `Unexpected error occurred`
        );
      }
    }
  }

  async generateRandomBase32() {
    const buffer = crypto.randomBytes(15);
    const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
    return base32;
  }

  /**
   * @description generate OTP for Two factor Authentiaction
   * @param userId string user uniquer Id
   * @param res Express Response
   * @returns void or otpurl
   */
  async generateOTP(
    details: GenerateOTPDto,
    res: Response
  ): Promise<string | void> {
    try {
      const { userId } = details;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        jsonResponse(StatusCodes.NOT_FOUND, "", res, "User not found");
        return;
      }
      const base32Secret = await this.generateRandomBase32();

      let totp = new OTPAuth.TOTP({
        issuer: "codevoweb.com",
        label: "CodevoWeb",
        algorithm: "SHA1",
        digits: 6,
        secret: base32Secret,
      });

      let otpAuthUrl = totp.toString();
      await this.userService.updateUser(user, {
        otpAuthUrl,
        otpBase32: base32Secret,
      });
      return otpAuthUrl;
    } catch (error) {
      console.error(error);
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error generatingOTP: ${error}`
      );
    }
  }

  /**
   * @description verify otp and enable 2FA
   * @param token string otp from 2fa
   * @param userId string user Id
   * @param res Express Response
   * @returns
   */
  async verifyOTP(details: VerifyAndEnable2FADto, res: Response) {
    try {
      const { otp, userId } = details;
      const user = await this.userService.getUserById(userId);
      const message = "Token is invalid or User doesn't exist";
      if (!user) {
        jsonResponse(StatusCodes.NOT_FOUND, "", res, message);
        return;
      }

      const totp = new OTPAuth.TOTP({
        issuer: "codevoweb.com",
        label: "CodevoWeb",
        algorithm: "SHA1",
        digits: 6,
        secret: user.otpBase32,
      });
      const delta = totp.validate({ token: otp });
      if (delta === null) {
        jsonResponse(StatusCodes.BAD_REQUEST, "", res, message);
      }
      const updatedUser = await this.userService.updateUser(user, {
        twoFactorEnabled: true,
        twoFactVerified: true,
      });

      return updatedUser;
    } catch (error) {
      console.error(error);
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error verifying OTP: ${error} `
      );
    }
  }

  /**
   * @description Verifies the OTP for a user
   * @param details TwoFAValidationDTO
   * @param res Express Response
   */
  async validateOTP(details: TwoFAValidationDTO, res: Response) {
    try {
      const { tempToken, otp } = details;

      // Decode the temporary token to get userId
      const decoded = jwt.verify(tempToken, process.env.TEMP_TOKEN_SECRET!);
      const { userId } = decoded as { userId: string };
      const user = await this.userService.getUserById(userId);
      const message = "Token is invalid or user doesn't exist";
      if (!user) {
        jsonResponse(StatusCodes.BAD_REQUEST, "", res, message);
        return;
      }
      let totp = new OTPAuth.TOTP({
        issuer: "codevoweb.com",
        label: "CodevoWeb",
        algorithm: "SHA1",
        digits: 6,
        secret: user.otpBase32,
      });
      let delta = totp.validate({ token: otp, window: 1 });
      if (!delta) {
        jsonResponse(StatusCodes.BAD_REQUEST, "", res, message);
        return;
      }
      // Issue final JWT upon successful 2FA verification
      const token = await this.createAndSendToken(user, res);
      return { token, user };
    } catch (error) {
      console.error(error);
      jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Error valiadting OTP: ${error}`
      );
    }
  }
}
