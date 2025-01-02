"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfFilter = exports.imageFilter = exports.multerStorageDev = exports.cloudMulterStorage = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer = __importStar(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
require("dotenv/config");
// Create S3 instance using S3Client
const s3 = new client_s3_1.S3Client({
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    },
    region: process.env.AWS_REGION,
});
/**
 * Create multer S3 storage configuration
 *
 * @param {string} modelName - Name of the image model on cloud
 * @returns {StorageEngine}
 */
const cloudMulterStorage = (modelName) => (0, multer_s3_1.default)({
    acl: "public-read",
    s3,
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    bucket: process.env.AWS_S3_BUCKET_NAME || '',
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${modelName}/${file.originalname.replace(/ /g, "-")}-${Date.now()}${ext}`);
    },
});
exports.cloudMulterStorage = cloudMulterStorage;
/**
 * Create local disk storage configuration
 *
 * @param {string} model - Local storage model
 * @returns {StorageEngine}
 */
const multerStorageDev = (model) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public", model));
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${(0, uuid_1.v4)()}-${originalname}`);
    },
});
exports.multerStorageDev = multerStorageDev;
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image'))
        cb(null, true);
    else
        cb(null, false);
};
exports.imageFilter = imageFilter;
const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf')
        cb(null, true);
    else
        cb(null, false);
};
exports.pdfFilter = pdfFilter;
