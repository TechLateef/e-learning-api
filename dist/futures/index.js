"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uploadHandler_1 = require("../core/utils/uploadHandler");
const routeRegister = (app) => {
    app.get('/', (req, res) => {
        res.send('Application is up and Running');
    });
    app.post('/api/v1/image/upload', uploadHandler_1.uploadImageSingle, uploadHandler_1.getImageUrlSingle);
};
exports.default = routeRegister;
