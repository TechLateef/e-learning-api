import { RequestHandler } from "express";
import { AuthService } from "../service/auth.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";
import { classToPlain, plainToInstance } from "class-transformer";
import { UserResponseDTO } from "../dto/auth.dto";
import { User } from "../../users/entities/user.entity";
import { responseFormat } from "../../../core/utils/responseFormat.utils";
import { transformResponse } from "../../../core/utils/transformAndValidate";
import { encrypt } from "../../../core/utils/encrypt.utils";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description this function create new User
   * @access public
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   * 
   */
  signup: RequestHandler = async (req, res, next) => {
    try {
      const user = await this.authService.signUp(req.body, res);
      const response = plainToInstance(UserResponseDTO,user, {excludeExtraneousValues: true})
      jsonResponse(StatusCodes.OK, response, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  /**
   * @description this function login user using provided email and password
   * @access public
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  login: RequestHandler = async (req, res, next) => {
    try {
      
      const user = await this.authService.login(req.body, res);
      if (!user) {
        console.log(user);
        throw new Error('No result found',);
      }
      const token =  encrypt.generateToken(user)
      
      // const userReponse = await transformResponse(UserResponseDTO,(user as User))
      jsonResponse(StatusCodes.OK, {token}, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description Verify user account using provided dto
   * @access public
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  verifyAccount: RequestHandler = async (req, res, next) => {
    try {
      const message = await this.authService.verifyAccount(req.body, res);

      jsonResponse(StatusCodes.OK, "", res, message as string);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description Fetch user profile
   * @access private
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  getProfile: RequestHandler = async (req, res, next) => {
    try {
      const user = this.authService.getProfile(req.body, res);
      const userResponse = responseFormat(UserResponseDTO, user);

      jsonResponse(StatusCodes.OK, userResponse, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description update user data
   * @access private
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  updateProfile: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const updatedUser = await this.authService.updateProfile(
        req.body,
        userId!,
        res
      );
      const userResponse = responseFormat(UserResponseDTO, updatedUser);

      jsonResponse(StatusCodes.OK, userResponse, res);
    } catch (error) {
      console.error(error);
      next(next);
    }
  };
  /**
   * @description this function send otp email provided by user
   * @access public
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  forgetPassword: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.authService.forgetPassword(req.body, res);
      jsonResponse(StatusCodes.OK, "", res, result as string);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description this function reset user password to new password provided
   * @access public
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  resetPassword: RequestHandler = async (req, res, next) => {
    try {
      const response = await this.authService.resetpassword(req.body, res);
      jsonResponse(StatusCodes.OK, "", res, response as string);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description Generate otp for 2FA and return otp url
   * @access private
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  generateOtp: RequestHandler = async (req, res, next) => {
    try {
      const otpurl = await this.authService.generateOTP(req.body, res);
      jsonResponse(StatusCodes.OK, otpurl, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description Verify otp and enable 2FA
   * @access private
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  verifyAndEnable2FA: RequestHandler = async (req, res, next) => {
    try {
      const response = await this.authService.verifyOTP(req.body, res);
      jsonResponse(StatusCodes.OK, response, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   * @description Verify otp to login
   * @access private
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  verifyOtpToLogin: RequestHandler = async (req, res, next) => {
    try {
      const response = await this.authService.validateOTP(req.body, res);
      jsonResponse(StatusCodes.OK, response, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
