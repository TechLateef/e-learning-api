import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { dtoValidationMiddleware } from "../../../core/middleware/dtoValidationMiddleware";
import { CreateUserDto } from "../../users/dtos/createUser.dto";
import { GenerateOTPDto, LoginDTO, TwoFAValidationDTO, VerifyAndEnable2FADto } from "../dto/auth.dto";
import { ServiceFactory } from "../../../core/factories/service.factory";


const authRouter = Router()

const authService = ServiceFactory.getAuthService();

const authController = new AuthController(authService)


// Route for user rehisteration
authRouter.post('/signup', dtoValidationMiddleware(CreateUserDto), authController.signup)


//Route to login user
authRouter.post('/login', dtoValidationMiddleware(LoginDTO), authController.login)

authRouter.post('/verify-account', authController.verifyAccount)


authRouter.post('/generate-otp', dtoValidationMiddleware(GenerateOTPDto), authController.generateOtp);

authRouter.post('/enable-2fa', dtoValidationMiddleware(VerifyAndEnable2FADto), authController.verifyAndEnable2FA);

authRouter.post('/validate-2fa', dtoValidationMiddleware(TwoFAValidationDTO), authController.verifyOtpToLogin);

export default authRouter;