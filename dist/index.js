"use strict";
/**
 * The Entry Point of the application
 * Sets up following:
 * Environment Variables
 * Express server
 * Database
 * And Finally Spins up the server
 */
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./src/data-source");
const session = __importStar(require("express-session"));
/* Configure Environment Variables */
require("dotenv/config");
const { PORT = 3000 } = process.env;
// Setup Express Server
const index_1 = __importDefault(require("./src/index"));
// Configure session middleware
index_1.default.use(session.default({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
}));
/* Start Server */
/* Start Server */
const startServer = async () => {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is undefined
        index_1.default.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Error during Data Source initialization:", error);
        // Exit process with failure code
        process.exit(1);
    }
};
startServer();
