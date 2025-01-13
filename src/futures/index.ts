import { Request, Response } from 'express'

import { uploadImageSingle, getImageUrlSingle } from '../core/utils/uploadHandler';
import authRouter from './auth/routers/auth.route';



// import { Express } from 'express';

const routeRegister = (app: any) => {

    const basePrefix = '/api/v1';
    app.get('/', (req: Request, res: Response) => {
        res.send('Application is up and Running');
    });

    app.post(`${basePrefix}/image/upload`, uploadImageSingle, getImageUrlSingle);
    app.use(`${basePrefix}/auth`, authRouter);

  // Catch All
  app.all("*",  (req: Request, res: Response,) => {
    return res.status(404).json({
      status: "fail",
      message: `Route: ${req.originalUrl} not found`,
    });
  });

};

export default routeRegister;
