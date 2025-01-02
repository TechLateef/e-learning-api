"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const dtoValidationMiddleware_1 = require("../../../core/middleware/dtoValidationMiddleware");
const createUser_dto_1 = require("../../users/dtos/createUser.dto");
const auth_dto_1 = require("../dto/auth.dto");
const service_factory_1 = require("../../../core/factories/service.factory");
const authRouter = (0, express_1.Router)();
const authService = service_factory_1.ServiceFactory.getAuthService();
const authController = new auth_controller_1.AuthController(authService);
// Route for user rehisteration
authRouter.post('/signup', (0, dtoValidationMiddleware_1.dtoValidationMiddleware)(createUser_dto_1.CreateUserDto), authController.signup);
//Route to login user
authRouter.post('/login', (0, dtoValidationMiddleware_1.dtoValidationMiddleware)(auth_dto_1.LoginDTO), authController.login);
authRouter.post('/verify-account', authController.verifyAccount);
authRouter.post('/generate-otp', (0, dtoValidationMiddleware_1.dtoValidationMiddleware)(auth_dto_1.GenerateOTPDto), authController.generateOtp);
authRouter.post('/enable-2fa', (0, dtoValidationMiddleware_1.dtoValidationMiddleware)(auth_dto_1.VerifyAndEnable2FADto), authController.verifyAndEnable2FA);
authRouter.post('/validate-2fa', (0, dtoValidationMiddleware_1.dtoValidationMiddleware)(auth_dto_1.TwoFAValidationDTO), authController.verifyOtpToLogin);
exports.default = authRouter;
