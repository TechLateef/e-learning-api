"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const requireFieldHandler_1 = require("../../../core/utils/requireFieldHandler");
const http_status_codes_1 = require("http-status-codes");
const class_transformer_1 = require("class-transformer");
const auth_dto_1 = require("../dto/auth.dto");
const class_validator_1 = require("class-validator");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        /**
         * @description register new user
         * @access public
         * @router POST /signup
         * @param req Express Request
         * @param res Express Response
         * @param next Express NextFunction
         */
        this.signUp = async (req, res, next) => {
            try {
                const { username, email, password } = req.body;
                const requireFields = ['username', 'email', 'password'];
                requireFieldHandler_1.RequireFieldHandler.Requiredfield(req, res, requireFields);
                const newUser = await this.authService.createUser({ username, email, password });
                if (!newUser) {
                    throw new Error('Error: User not Registered');
                }
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "success", newUser });
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error Registering user ${error}`);
            }
        };
        /**
            * @description Login  user
            * @access public
            * @router POST /login
            * @param req Express Request
            * @param res Express Response
            * @param next Express NextFunction
            */
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new Error('Invalid email or password');
                }
                const user = await this.authService.login(email, password);
                if (!user) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(user);
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.editProfile = async (req, res, next) => {
            var _a;
            try {
                const editProfileData = (0, class_transformer_1.plainToClass)(auth_dto_1.EditProfileDto, req.body);
                const errors = await (0, class_validator_1.validate)(editProfileData);
                if (errors.length > 0) {
                    res.status(400).json({ errors: errors.map(error => error.toString()) });
                }
                const editedProfile = await this.authService.editProfile(editProfileData, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success', editedProfile });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @description get User profile with username
         * @access private
         * @route GET /get-user
         * @param req Express Request
         * @param res Express Response
         * @param next
         */
        this.getUserByUsername = async (req, res, next) => {
            try {
                const username = req.body.username;
                const isUser = await this.authService.getUserByUsername(username);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Success", isUser });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @description follow or unfollow user depending on if they are already following each other or not
         * @access private
         * @route PATCH /follow-or-unfollow
         * @param req
         * @param res
         * @param next
         */
        this.followOrUnfollow = async (req, res, next) => {
            try {
                const targetUserId = req.params.targetUserId;
                const currentUser = req.user;
                const followOrUnFollow = await this.authService.followOrUnfollow(targetUserId, currentUser);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Success', followOrUnFollow });
            }
            catch (error) {
                console.error(error);
                throw new Error("Internal server Error, Our team are working on it");
            }
        };
    }
}
exports.AuthController = AuthController;
