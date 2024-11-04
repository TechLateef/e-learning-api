import { Request, Response } from 'express'

import { uploadImageSingle, getImageUrlSingle } from '../core/utils/uploadHandler';



const routeRegister = (app: any) => {
    app.get('/', (req: Request, res: Response) => {
        res.send('Application is up and Running');
    })

    app.post('/api/v1/image/upload', uploadImageSingle, getImageUrlSingle)

}

export default routeRegister;