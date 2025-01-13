import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from "typeorm";
// 
const port = process.env.DB_PORT as number | undefined;
// 
export const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.DB_HOST,
   port: port,
   username: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
//   
   entities: [`${__dirname}/**/**/entities/*.{ts,js}`],
   migrations: [`${__dirname}/**/**/migrations/*.{ts,js}`],
   extra: {
      max: 20, // Maximum number of connections in the pool
      connectionTimeoutMillis: 2000, // Wait time before timing out
      idleTimeoutMillis: 30000, // Time before closing idle connections
    },
})


// import 'dotenv/config';
// import 'reflect-metadata';
// import { DataSource } from "typeorm";
// import path from "path";
// 
// const port = parseInt(process.env.DB_PORT || "5432", 10); // Default to 5432 if not defined
// 
// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost', // Default to localhost
//   port: port,
//   username: process.env.DB_USER || 'postgres', // Default to 'postgres'
//   password: process.env.DB_PASS || '',
//   database: process.env.DB_NAME || 'mydb',
//   synchronize: false, // Avoid auto-migrations in production
//   logging: true, // Enable query logging for debugging
//   entities: [path.join(__dirname, '**', '**', 'entities', '*.{ts,js}')],
//   migrations: [path.join(__dirname, '**', '**', 'migrations', '*.{ts,js}')],
//   extra: {
   //  max: 20, // Maximum number of connections in the pool
   //  connectionTimeoutMillis: 2000, // Wait time before timing out
   //  idleTimeoutMillis: 30000, // Time before closing idle connections
//   },
// });
// 