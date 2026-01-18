import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import connectDatabase from './config/database.js';

const app = express();
const PORT = 3000;
const connectionString = 'mongodb://localhost:27017/library';

// Connect to the database
connectDatabase(connectionString);