import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../../data-source";
import jsonResponse from "../utils/lib";
import { User } from "../../futures/users/entities/user.entity";
import { rateLimit } from "express-rate-limit";
// interface User {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
// }

const authenticationMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.id) return next();

    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      jsonResponse(
        StatusCodes.UNAUTHORIZED,
        "",
        res,
        "You are not logged in, please log in to get access"
      );
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET!;
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      jsonResponse(
        StatusCodes.UNAUTHORIZED,
        "",
        res,
        "The user with this token no longer exists"
      );

      return;
    }

    req.user = user;
    req.user.password = ""; // Clear sensitive data
    next();
  } catch (error) {
    jsonResponse(StatusCodes.UNAUTHORIZED, "", res, `Not Authorized: ${error}`);
  }
};

const authorize = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return jsonResponse(
          StatusCodes.UNAUTHORIZED,
          "",
          res,
          "User role is missing."
        );
      }

      if (allowedRoles.includes(userRole)) {
        return next();
      }

      return jsonResponse(
        StatusCodes.UNAUTHORIZED,
        "",
        res,
        "You do not have permission to perform this action."
      );
    } catch (error) {
      return jsonResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "",
        res,
        `Authorization error: ${error}`
      );
    }
  };
};

export const loginRatelimit = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minute
  limit: 5, //limit each IP to 5 request per 15 minute
  message:
    "Login error, you have reached maximum retries. Please try again after 30 minutes",
  statusCode: 429,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export { authorize };

export default authenticationMiddleware;
