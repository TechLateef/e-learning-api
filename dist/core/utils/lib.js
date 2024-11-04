"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const constants_1 = __importDefault(require("./constants"));
const jsonResponse = (code, data, res, message = "") => {
    const resp = {
        code,
        status: getStatus(code),
        message: getStatusMessage(code, message),
        ...data
    };
    res.status(code).json(resp);
};
const getStatus = (code) => {
    try {
        switch (code) {
            case http_status_codes_1.StatusCodes.CREATED:
            case http_status_codes_1.StatusCodes.OK:
                return "success";
            case http_status_codes_1.StatusCodes.ACCEPTED:
                return "accepted";
            case http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE:
            case http_status_codes_1.StatusCodes.BAD_REQUEST:
            case http_status_codes_1.StatusCodes.NOT_FOUND:
            case http_status_codes_1.StatusCodes.UNAUTHORIZED:
            case http_status_codes_1.StatusCodes.FORBIDDEN:
            case http_status_codes_1.StatusCodes.REQUEST_TIMEOUT:
            case http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR:
            case http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY:
                return "error";
            default:
                return "error";
        }
    }
    catch (error) {
        return error;
    }
};
const getStatusMessage = (code, extraInfo) => {
    try {
        switch (code) {
            case http_status_codes_1.StatusCodes.CREATED:
            case http_status_codes_1.StatusCodes.OK:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.RequestOk);
            case http_status_codes_1.StatusCodes.ACCEPTED:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.RequestAccepted);
            case http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.ServiceUnavailableMsg);
            case http_status_codes_1.StatusCodes.BAD_REQUEST:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.BadRequestMsg);
            case http_status_codes_1.StatusCodes.UNAUTHORIZED:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.UnauthorizedMsg);
            case http_status_codes_1.StatusCodes.FORBIDDEN:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.ForbiddenMsg);
            case http_status_codes_1.StatusCodes.NOT_FOUND:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.NotFoundMsg);
            case http_status_codes_1.StatusCodes.REQUEST_TIMEOUT:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.TimeOutMsg);
            case http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.InternalServerErrorMsg);
            case http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.UnprocessableEntityMsg);
            default:
                return (extraInfo === null || extraInfo === void 0 ? void 0 : extraInfo.trim()) || (constants_1.default.UnprocessableEntityMsg);
        }
    }
    catch (error) {
        return error;
    }
};
exports.default = jsonResponse;
