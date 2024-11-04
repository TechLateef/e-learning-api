"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnectionString = process.env.NODE_ENV === 'production'
    ? process.env.DB_CONNECTION.replace('<password>', process.env.DB_PASSWORD).replace('<username>', process.env.DB_USERNAME)
    : process.env.mongo_URIS;
mongoose_1.default.connect(dbConnectionString).then(() => {
    console.log('Connected successfully to MongoDB');
}).catch((error) => {
    console.error('Connection error:', error.message);
});
const db = mongoose_1.default.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
});
exports.default = db;
