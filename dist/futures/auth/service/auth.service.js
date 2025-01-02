"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const lib_1 = __importDefault(require("../../../core/utils/lib"));
const encrypt_utils_1 = require("../../../core/utils/encrypt.utils");
const otp_generator_1 = require("otp-generator");
const email_service_1 = require("../../email/email.service");
const OTPAuth = __importStar(require("otpauth"));
const hi_base32_1 = require("hi-base32");
const crypto_1 = __importDefault(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
class AuthService {
    constructor(userService, studentService, instructorService) {
        this.userService = userService;
        this.studentService = studentService;
        this.instructorService = instructorService;
    }
    async createAndSendToken(user, res) {
        try {
            const token = await encrypt_utils_1.encrypt.generateToken(user);
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 1 * 24 * 60 * 60),
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true
            });
            res.set("authorization", token);
            return token;
        }
        catch (error) {
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
    async signUp(details, res) {
        try {
            const { role } = details;
            const user = await this.userService.createUser(details, res);
            const newUser = user;
            if (role === 'Student') {
                await this.studentService.createStudent({ user: newUser });
            }
            else if (role === 'Instructor') {
                await this.instructorService.createInstructor({ user: newUser });
            }
            return user;
        }
        catch (error) {
            console.error(error);
            (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res);
        }
    }
    /**
     * @description this function allows a user to log in
     * @param details LoginDTO
     * @param res Express Response
     * @returns
     */
    async login(details, res) {
        try {
            const user = await this.userService.getUserByEmail(details.email);
            if (!user) {
                (0, lib_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, '', res, 'Invalid email or password');
                return;
            }
            const isPasswordValid = await encrypt_utils_1.encrypt.comparedata(user.password, details.password);
            if (!isPasswordValid) {
                (0, lib_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, '', res, 'Invalid email or password');
                return;
            }
            // Check if 2FA is enabled
            if (user.twoFactorEnabled) {
                // Respond with a temporary token for 2FA
                const tempToken = this.createTemporaryToken(user.id); // Temporary token creation logic
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, { requires2FA: true, tempToken }, res);
                return;
            }
            // Issue JWT directly for non-2FA users
            const token = await this.createAndSendToken(user, res);
            return { token, user };
        }
        catch (error) {
            console.error(error);
            (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error: ${error}`);
        }
    }
    /**
     * Temporary token creation logic
     */
    createTemporaryToken(userId) {
        // Implement your temporary token logic, e.g., a short-lived JWT
        return jwt.sign({ userId }, process.env.TEMP_TOKEN_SECRET, { expiresIn: '5m' });
    }
    /**
     * @description this function send otp via user email
     * @dev opt is been hashed on the entity level
     * @param email string user email
     * @param res Express response
     * @returns void
     */
    async forgetPassword(email, res) {
        try {
            const user = await this.userService.getUserByEmail(email);
            const genericMessage = 'If an account with this email exists, an OTP has been sent to your email.';
            // Generic response for non-existent email
            if (!user) {
                return (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, null, res, genericMessage);
            }
            // Generate OTP and expiry
            const otp = (0, otp_generator_1.generate)(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false });
            const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
            // Update user with OTP
            await this.userService.updateUser(user, { passwordResetOTP: otp, otpExpiresAt });
            // Send email
            await new email_service_1.EmailService(user, '', '', otp).sendPasswordReset();
            return genericMessage;
        }
        catch (error) {
            console.error('Error in forgetPassword:', error);
            return (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, null, res, 'An error occurred while processing your request. Please try again later.');
        }
    }
    /**
     * @description verify user account using provided OTP
     * @param otp string
     * @param res Express Response
     * @returns void
     */
    async verifyAccount(otp, res) {
        try {
            const hashedOtp = await encrypt_utils_1.encrypt.encryptdata(otp);
            const user = await this.userService.findUserByOTP(hashedOtp);
            // Validate user and OTP expiry
            const currentTime = new Date();
            if (!user || currentTime > user.otpExpiresAt) {
                (0, lib_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, '', res, 'Invalid OTP or OTP has expired');
                return;
            }
            await this.userService.updateUser(user, { verified: true });
            const message = 'Account verified ✅ please login';
            return message;
        }
        catch (error) {
            console.error(error);
            (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error verifying user account: ${error}`);
        }
    }
    /**
     * @description Updates the user password using the provided OTP and new password.
     * @param details ResetPasswordDTO - Contains OTP and newPassword.
     * @param res Express Response
     * @returns void
     */
    async resetpassword(details, res) {
        try {
            const { OTP, newPassword } = details;
            // Find user by OTP
            const hashedOtp = await encrypt_utils_1.encrypt.encryptdata(OTP);
            const user = await this.userService.findUserByOTP(hashedOtp);
            // Validate user and OTP expiry
            const currentTime = new Date();
            if (!user || currentTime > user.otpExpiresAt) {
                (0, lib_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, '', res, 'Invalid OTP or OTP has expired');
                return;
            }
            // Update user data
            await this.userService.updateUser(user, {
                otp: null,
                otpExpiresAt: null,
                password: newPassword // Will be hashed by @BeforeUpdate hook in User entity
            });
            // Respond with success
            return 'Password has been reset successfully';
        }
        catch (error) {
            // Narrow the error type
            if (error instanceof Error) {
                console.error('Error during password reset:', error.message);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error while updating user password: ${error.message}`);
            }
            else {
                console.error('Unexpected error:', error);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Unexpected error occurred`);
            }
        }
    }
    async generateRandomBase32() {
        const buffer = crypto_1.default.randomBytes(15);
        const base32 = (0, hi_base32_1.encode)(buffer).replace(/=/g, "").substring(0, 24);
        return base32;
    }
    ;
    /**
     * @description generate OTP for Two factor Authentiaction
     * @param userId string user uniquer Id
     * @param res Express Response
     * @returns void or otpurl
     */
    async generateOTP(details, res) {
        try {
            const { userId } = details;
            const user = await this.userService.getUserById(userId);
            if (!user) {
                (0, lib_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, '', res, 'User not found');
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
            await this.userService.updateUser(user, { otpAuthUrl, otpBase32: base32Secret });
            return otpAuthUrl;
        }
        catch (error) {
            console.error(error);
            (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error generatingOTP: ${error}`);
        }
    }
    /**
     * @description verify otp and enable 2FA
     * @param token string otp from 2fa
     * @param userId string user Id
     * @param res Express Response
     * @returns
     */
    async verifyOTP(details, res) {
        try {
            const { otp, userId } = details;
            const user = await this.userService.getUserById(userId);
            const message = "Token is invalid or User doesn't exist";
            if (!user) {
                (0, lib_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, '', res, message);
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
                (0, lib_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, '', res, message);
            }
            ;
            const updatedUser = await this.userService.updateUser(user, { twoFactorEnabled: true, twoFactVerified: true });
            return updatedUser;
        }
        catch (error) {
            console.error(error);
            (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error verifying OTP: ${error} `);
        }
    }
    /**
     * @description Verifies the OTP for a user
     * @param details TwoFAValidationDTO
     * @param res Express Response
     */
    async validateOTP(details, res) {
        try {
            const { tempToken, otp } = details;
            // Decode the temporary token to get userId
            const decoded = jwt.verify(tempToken, process.env.TEMP_TOKEN_SECRET);
            const { userId } = decoded;
            const user = await this.userService.getUserById(userId);
            const message = "Token is invalid or user doesn't exist";
            if (!user) {
                (0, lib_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, '', res, message);
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
                (0, lib_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, '', res, message);
                return;
            }
            // Issue final JWT upon successful 2FA verification
            const token = await this.createAndSendToken(user, res);
            return { token, user };
        }
        catch (error) {
            console.error(error);
            (0, lib_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, '', res, `Error valiadting OTP: ${error}`);
        }
    }
}
exports.AuthService = AuthService;
