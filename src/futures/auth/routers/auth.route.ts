import { Router } from "express";
import express from "express";
import { AuthController } from "../controller/auth.controller";
import { dtoValidationMiddleware } from "../../../core/middleware/dtoValidationMiddleware";
import { CreateUserDto } from "../../users/dtos/createUser.dto";
import { GenerateOTPDto, GetProfileDto, LoginDTO, TwoFAValidationDTO, UpdateUserProfileDto, VerifyAndEnable2FADto } from "../dto/auth.dto";
import { ServiceFactory } from "../../../core/factories/service.factory";
import authenticationMiddleware from "../../../core/middleware/middleware";

// Centralized route paths
const ROUTES = {
  SIGNUP: "/signup",
  LOGIN: "/login",
  VERIFY_ACCOUNT: "/verify-account",
  GENERATE_OTP: "/generate-otp",
  ENABLE_2FA: "/enable-2fa",
  VALIDATE_2FA: "/validate-2fa",
  GET_PROFILE: "/profile",
  UPDATE_PROFILE: "/profile-update",
} as const;

const authRouter = Router();
const authService = ServiceFactory.getAuthService();
const authController = new AuthController(authService);

/**
 * @route POST /signup
 * @description Registers a new user
 * @access public
 */
authRouter.post(ROUTES.SIGNUP, dtoValidationMiddleware(CreateUserDto), authController.signup);

/**
 * @route POST /login
 * @description Logs in a user and returns a JWT token
 * @access public
 */
authRouter.post(ROUTES.LOGIN, dtoValidationMiddleware(LoginDTO), authController.login);

/**
 * @route POST /verify-account
 * @description Verifies a user's account using a token
 * @access public
 */
authRouter.post(ROUTES.VERIFY_ACCOUNT, authController.verifyAccount);

// Middleware to protect routes
authRouter.use(authenticationMiddleware as express.RequestHandler);

/**
 * @route POST /generate-otp
 * @description Generates a one-time password (OTP) for two-factor authentication
 * @access protected
 */
authRouter.post(ROUTES.GENERATE_OTP, dtoValidationMiddleware(GenerateOTPDto), authController.generateOtp);

/**
 * @route POST /enable-2fa
 * @description Enables two-factor authentication for a user
 * @access protected
 */
authRouter.post(ROUTES.ENABLE_2FA, dtoValidationMiddleware(VerifyAndEnable2FADto), authController.verifyAndEnable2FA);

/**
 * @route POST /validate-2fa
 * @description Validates the OTP provided for login
 * @access protected
 */
authRouter.post(ROUTES.VALIDATE_2FA, dtoValidationMiddleware(TwoFAValidationDTO), authController.verifyOtpToLogin);

/**
 * @route GET /profile
 * @description Retrieves the authenticated user's profile
 * @access protected
 */
authRouter.get(ROUTES.GET_PROFILE, dtoValidationMiddleware(GetProfileDto), authController.getProfile);

/**
 * @route PATCH /profile-update
 * @description Updates the authenticated user's profile
 * @access protected
 */
authRouter.patch(ROUTES.UPDATE_PROFILE, dtoValidationMiddleware(UpdateUserProfileDto), authController.updateProfile);

export default authRouter;
