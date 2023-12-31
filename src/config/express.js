import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'
import { connectToMongoDB } from './db.js';


const app = express();
app.use(cors({
  origin: '*',
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
connectToMongoDB()

export default app