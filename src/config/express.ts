import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import passport from '../passport/passport-config';
import session from 'express-session';
import routes from './routes';

import { initializeSocketIO } from '../socket/index';
const app = express();

export const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:4001', 'http://localhost:6006'],
    credentials: true,
  },
});
app.set('io', io);

app.use(
  cors({
    origin: [
      'http://localhost:4001',
      'http://localhost:6006',
      'http://localhost:3000',
    ],
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
routes(app);

initializeSocketIO(io);

export default app;
