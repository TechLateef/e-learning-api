"use strict";
/**
 * The Entry Point of the application
 * Sets up following:
 * Environment Variables
 * Express server
 * Database
 * And Finally Spins up the server
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./src/data-source");
/* Configure Environment Variables */
require("dotenv/config");
const { PORT = 3000 } = process.env;
// Setup Express Server
const index_1 = __importDefault(require("./src/index"));
// Configure session middleware
// app.use(session.default({
// secret: process.env.SESSION_SECRET || "",
// resave: false,
// saveUninitialized: false,
// }));
// 
// 
// 
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
