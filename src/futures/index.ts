import { Request, Response } from 'express'

import { uploadImageSingle, getImageUrlSingle } from '../core/utils/uploadHandler';
import authRouter from './auth/routers/auth.route';
import courseRouter from './course/routers/course.route';
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from '../core/utils/swaggerConfig';



// import { Express } from 'express';

const routeRegister = (app: any) => {

    const basePrefix = '/api/v1';
    app.get('/', (req: Request, res: Response) => {
        res.send('Application is up and Running');
    });
// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.post(`${basePrefix}/image/upload`, uploadImageSingle, getImageUrlSingle);
    app.use(`${basePrefix}/auth`, authRouter);
    app.use(`${basePrefix}/course`, courseRouter);

  // Catch All
  app.all("*",  (req: Request, res: Response,) => {
    return res.status(404).json({
      status: "fail",
      message: `Route: ${req.originalUrl} not found`,
    });
  });

};

export default routeRegister;
