import { Router } from "express";
import { ServiceFactory } from "../../../core/factories/service.factory";
import { AccessmentController } from "../controller/accessment.controller";
import { dtoValidationMiddleware } from "../../../core/middleware/dtoValidationMiddleware";
import { CreateAccessmentDto } from "../dtos/accessment.dto";
import authenticationMiddleware from "../../../core/middleware/middleware";
import express from 'express'

//Centralized route paths
const ROUTES = {
    CREATE_ACCESSMENT: "/create-accessment",
    GET_ACCESSMENT: '/accessment/:accessmentId'
} as const


const accessmentRouter = Router();

const accessmentService = ServiceFactory.getAccessmentService();
const accessmentController = new AccessmentController(accessmentService);


accessmentRouter.use(authenticationMiddleware as express.RequestHandler)

/**
 * @route POST /create-accessment
 * @description Create  new Accessment
 * @access protected
 */

accessmentRouter.post(ROUTES.CREATE_ACCESSMENT, dtoValidationMiddleware(CreateAccessmentDto), accessmentController.createAccessment);



/**
 * @route GET /accessment/:accessmentId
 * @description Retrieves Accessment using accessmnetId
 * @access protected
 */

accessmentRouter.get(ROUTES.GET_ACCESSMENT, accessmentController.getAccessment)