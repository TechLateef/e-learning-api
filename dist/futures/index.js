"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadHandler_1 = require("../core/utils/uploadHandler");
const auth_route_1 = __importDefault(require("./auth/routers/auth.route"));
const basePrefix = '/api/v1';
const routeRegister = (app) => {
    app.get('/', (req, res) => {
        res.send('Application is up and Running');
    });
    app.post(`${basePrefix}'/image/upload'`, uploadHandler_1.uploadImageSingle, uploadHandler_1.getImageUrlSingle);
    app.use(basePrefix, auth_route_1.default);
};
exports.default = routeRegister;
