import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { randomBytes, createHash } from "crypto";
import { User } from "../../futures/auth/entities/auth.entity";

dotenv.config();
const { JWT_SECRET = "" } = process.env;

export class encrypt {
    static async encryptpass(password: string) {
        // Generate salt dynamically with a cost factor of 10
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        return bcrypt.hashSync(password, salt);
    }

    static comparepassword(hashPassword: string, password: string) {
        return bcrypt.compareSync(password, hashPassword);
    }

    static generateToken(user: any) {
        return jwt.sign({ id: user.id, iat: Date.now() + 1000 }, JWT_SECRET, {
            expiresIn: "1d",
        });
    }

    static getPasswordResetToken = function (user: User) {
        const resetToken = randomBytes(32).toString("hex");

        const passwordResetToken = createHash("sha256")
            .update(resetToken)
            .digest("hex");

        //token expires after 15 minutes
        const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
        user.resetTokenExpiresAt = resetTokenExpiresAt;
        user.passwordResetToken = passwordResetToken;

        return resetToken;
    };
}