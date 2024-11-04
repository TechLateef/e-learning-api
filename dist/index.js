"use strict";
/**
 * Creates and configure the Express Server
 * Register view engines
 * Register middlewares
 * Register Routes
 * Register Wild catch middlewares
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const futures_1 = __importDefault(require("./futures"));
const middleware_1 = __importDefault(require("./core/middleware"));
const app = (0, express_1.default)();
// Register Middlewares
(0, middleware_1.default)(app);
// Register routers
(0, futures_1.default)(app);
exports.default = app;
