import { RequestHandler } from "express";
import { AccessmentService } from "../service/accessment.service";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";



export class AccessmentController {
    constructor( private readonly accessmentService: AccessmentService) {}

    /**
     * @description create new accessment
     * @param req Express Request
     * @param res Express Response
     * @param next Express Nextfunction
     */
    createAccessment: RequestHandler = async(req, res, next) => {
        try {
            const newAccessment = await this.accessmentService.createAccessment(req.body, res);
            jsonResponse(StatusCodes.CREATED, newAccessment, res);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }


    getAccessment: RequestHandler = async(req, res, next) => {
        try {
            const accessmentId = req.params.accessmentId 
            const accessment = await this.accessmentService.findById(accessmentId);
            if(!accessment) {
                jsonResponse(StatusCodes.NOT_FOUND, undefined, res);
                return;
            }
            jsonResponse(StatusCodes.OK, accessment, res);
        } catch (error) {
            console.error(error);
            next(error);
            
        }
    }

    
}