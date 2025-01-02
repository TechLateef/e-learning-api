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
exports.authorize = exports.authenticationMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const data_source_1 = require("../../data-source");
const lib_1 = __importDefault(require("../utils/lib"));
const user_entity_1 = require("../../futures/users/entities/user.entity");
// interface User {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
// }
const authenticationMiddleware = async (req, res, next) => {
    var _a, _b;
    // If user is already authenticated
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)
        return next();
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    else if ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "You are not logged in, please log in to get access" });
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET);
        const { id, iat } = decoded;
        // verify if user still exists
        // console.log("user", decoded)
        const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });
        if (!user) {
            return next(new Error("The user with this token no longer exists"));
        }
        // confirm if user doesn't change password after the token is issued
        req.user = user;
        req.user.password = '';
        next();
    }
    catch (error) {
        throw new Error(`Not Authorized ${error}`);
    }
};
exports.authenticationMiddleware = authenticationMiddleware;
const authorize = async (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (allowedRoles.includes(userRole)) {
            return next();
        }
        return (0, lib_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, '', res);
    };
};
exports.authorize = authorize;
