/**
 * Creates and configure the Express Server
 * Register view engines
 * Register middlewares
 * Register Routes
 * Register Wild catch middlewares
 */

import  express from 'express'

import routeRegister from './futures'
import middlewaresRegister from './core/middleware'

const app = express()


// Register Middlewares
middlewaresRegister(app)

// Register routers
routeRegister(app)


export default app