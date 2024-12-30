import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../../data-source";
import jsonResponse from "../utils/lib";
import { User } from "../../futures/users/entities/user.entity";

// interface User {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
// }


const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // If user is already authenticated
    if (req.user?.id) return next();

    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not logged in, please log in to get access" });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET!
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { id, iat } = decoded;

        // verify if user still exists
        // console.log("user", decoded)
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });
        if (!user) {
            return next(new Error("The user with this token no longer exists"));
        }

        // confirm if user doesn't change password after the token is issued

        req.user = user;
        req.user.password = ''
        next();
    } catch (error) {
        throw new Error(`Not Authorized ${error}`);
    }
};

const authorize = async (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user!.role;
        if (allowedRoles.includes(userRole)) {
            return next()
        }
        return jsonResponse(StatusCodes.UNAUTHORIZED, '', res)
    }
}
export { authenticationMiddleware, authorize };