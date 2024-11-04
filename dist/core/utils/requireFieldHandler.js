"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireFieldHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
class RequireFieldHandler {
    // Method to validate required fields
    static Requiredfield(req, res, requiredFields) {
        // Filter to find missing fields
        const missingFields = requiredFields.filter((field) => !(field in req.body));
        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(", ")}`;
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: errorMessage });
        }
    }
}
exports.RequireFieldHandler = RequireFieldHandler;
