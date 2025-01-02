"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
/**
 * Registers all custome and external middlewares
 * @param {Express} app The Express app
 */
const middlewaresRegister = (app) => {
    var corsOptions = {
        origin: "*",
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    };
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, cookie_parser_1.default)());
    app.use((0, helmet_1.default)());
    //   app.use(xss());
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    // Catch All
    app.all("*", (req, res) => {
        return res.status(404).json({
            status: "fail",
            message: `Route: ${req.originalUrl} not found`,
        });
    });
};
exports.default = middlewaresRegister;
