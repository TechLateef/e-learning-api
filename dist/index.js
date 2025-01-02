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
console.log('getting ready');
const { PORT = 3000 } = process.env;
// Setup Express Server
const index_1 = __importDefault(require("./src/index"));
// Configure session middleware
// app.use(session ({
//     secret: process.env.SESSION_SECRET || "",
//     resave: false,
//     saveUninitialized: false,
// }));
/* Start Server */
data_source_1.AppDataSource.initialize()
    .then(async () => {
    index_1.default.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
})
    .catch((error) => console.log(error));
