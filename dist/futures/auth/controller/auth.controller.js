"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const lib_1 = __importDefault(require("../../../core/utils/lib"));
const http_status_codes_1 = require("http-status-codes");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        /**
         * @description this function create new User
         * @access public
         * @param req Express Request
         * @param res Express Response
         * @param next Express NextFunction
         */
        this.signup = async (req, res, next) => {
            try {
                const user = await this.authService.signUp(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, user, res);
            }
            catch (error) {
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
        this.login = async (req, res, next) => {
            try {
                const result = await this.authService.login(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, result, res);
            }
            catch (error) {
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
        this.verifyAccount = async (req, res, next) => {
            try {
                const message = await this.authService.verifyAccount(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, '', res, message);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        };
        /**
         * @description this function send otp email provided by user
         * @access public
         * @param req Express Request
         * @param res Express Response
         * @param next Express NextFunction
         */
        this.forgetPassword = async (req, res, next) => {
            try {
                const result = await this.authService.forgetPassword(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, '', res, result);
            }
            catch (error) {
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
        this.resetPassword = async (req, res, next) => {
            try {
                const response = await this.authService.resetpassword(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, '', res, response);
            }
            catch (error) {
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
        this.generateOtp = async (req, res, next) => {
            try {
                const otpurl = await this.authService.generateOTP(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, otpurl, res);
            }
            catch (error) {
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
        this.verifyAndEnable2FA = async (req, res, next) => {
            try {
                const response = await this.authService.verifyOTP(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, response, res);
            }
            catch (error) {
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
        this.verifyOtpToLogin = async (req, res, next) => {
            try {
                const response = await this.authService.validateOTP(req.body, res);
                (0, lib_1.default)(http_status_codes_1.StatusCodes.OK, response, res);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
