"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdfUrl = exports.pdfUploadSingle = exports.getImageUrlSingle = exports.getImagesUrlArray = exports.uploadImageSingle = exports.uploadImagesArray = void 0;
const multer_1 = __importDefault(require("multer"));
const http_status_codes_1 = require("http-status-codes");
const awsStorage_1 = require("./awsStorage");
const catchAsync_1 = __importDefault(require("./catchAsync"));
const multerStorageProd = (0, awsStorage_1.cloudMulterStorage)('profile');
const multerStorageDevInstance = (0, awsStorage_1.multerStorageDev)('img/profile');
const imageUploader = (0, multer_1.default)({
    storage: process.env.NODE_ENV === 'development' ? multerStorageDevInstance : multerStorageProd,
    fileFilter: awsStorage_1.imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 12, // Maximum 12mb file
    },
});
const devFunc = (req) => (file) => {
    return `${req.protocol}://${req.get('host')}/img/profile/${file.filename}`;
};
const prodFunc = (file) => file.location;
exports.uploadImagesArray = imageUploader.array('images', 10);
exports.uploadImageSingle = imageUploader.single('image');
exports.getImagesUrlArray = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.files) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'failed', message: 'No files were passed' });
    }
    const images = req.files.map(process.env.NODE_ENV === 'development' ? devFunc(req) : prodFunc);
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', result: images.length, data: images });
});
exports.getImageUrlSingle = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.file) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'failed', message: 'No file was passed' });
    }
    const url = process.env.NODE_ENV === 'development'
        ? devFunc(req)(req.file)
        : prodFunc(req.file);
    // console.log("url",url,req.file)
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success', data: url });
});
const pdfUploader = (0, multer_1.default)({
    storage: process.env.NODE_ENV === 'development' ? (0, awsStorage_1.multerStorageDev)('/documents') : multerStorageProd,
    fileFilter: awsStorage_1.pdfFilter,
    limits: {
        fileSize: 1024 * 1024 * 4, // Maximum 4mb file
    },
});
const devPdfFunc = (req) => (file) => {
    return `${req.protocol}://${req.get('host')}/pdf/${file.filename}`;
};
exports.pdfUploadSingle = pdfUploader.single("pdfFile");
exports.getPdfUrl = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.file) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ status: "failed", message: "No file was passed" });
    }
    const url = process.env.NODE_ENV === "development"
        ? devPdfFunc(req)(req.file)
        : prodFunc(req.file);
    res.status(http_status_codes_1.StatusCodes.OK).json({ status: "success", data: url });
});
