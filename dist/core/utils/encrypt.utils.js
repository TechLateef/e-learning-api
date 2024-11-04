"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = require("crypto");
dotenv_1.default.config();
const { JWT_SECRET = "" } = process.env;
class encrypt {
    static async encryptpass(password) {
        // Generate salt dynamically with a cost factor of 10
        const salt = await bcryptjs_1.default.genSalt(10);
        // Hash the password using the generated salt
        return bcryptjs_1.default.hashSync(password, salt);
    }
    static comparepassword(hashPassword, password) {
        return bcryptjs_1.default.compareSync(password, hashPassword);
    }
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, iat: Date.now() + 1000 }, JWT_SECRET, {
            expiresIn: "1d",
        });
    }
}
exports.encrypt = encrypt;
encrypt.getPasswordResetToken = function (user) {
    const resetToken = (0, crypto_1.randomBytes)(32).toString("hex");
    const passwordResetToken = (0, crypto_1.createHash)("sha256")
        .update(resetToken)
        .digest("hex");
    //token expires after 15 minutes
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    user.resetTokenExpiresAt = resetTokenExpiresAt;
    user.passwordResetToken = passwordResetToken;
    return resetToken;
};
