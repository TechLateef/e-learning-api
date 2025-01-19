/**
 * The Entry Point of the application
 * Sets up following:
 * Environment Variables
 * Express server
 * Database
 * And Finally Spins up the server
 */

import "reflect-metadata";
import { AppDataSource } from './src/data-source';



import * as session from 'express-session';

/* Configure Environment Variables */
import 'dotenv/config'

const { PORT = 3000 } = process.env;

// Setup Express Server
import app from './src/index'


// Configure session middleware
// app.use(session.default({
  // secret: process.env.SESSION_SECRET || "",
  // resave: false,
  // saveUninitialized: false,
// }));
// 
// 
// 
/* Start Server */
/* Start Server */
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is undefined
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);

    // Exit process with failure code
    process.exit(1);
  }
};

startServer();








