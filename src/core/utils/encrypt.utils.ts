import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { randomBytes, createHash } from "crypto";
import { User } from "../../futures/users/entities/user.entity";

dotenv.config();
const { JWT_SECRET = "" } = process.env;

export class encrypt {
    static async encryptdata(plainString: string) {
        // Generate salt dynamically with a cost factor of 10
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        return bcrypt.hashSync(plainString, salt);
    }

    static comparedata(hashedString: string, plainString: string) {
        return bcrypt.compareSync(plainString, hashedString);
    }

    static generateToken(user: any) {
        return jwt.sign({ id: user.id, iat: Date.now() + 1000 }, JWT_SECRET, {
            expiresIn: "1d",
        });
    }

    static getPasswordResetOTP = function (user: User) {
        const resetToken = randomBytes(32).toString("hex");

        const passwordResetOTP = createHash("sha256")
            .update(resetToken)
            .digest("hex");

        //token expires after 15 minutes
        const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        user.resetOTPExpiresAt = resetTokenExpiresAt;
        user.passwordResetOTP = passwordResetOTP;

        return resetToken;
    };
}