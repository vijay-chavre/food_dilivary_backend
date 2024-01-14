import express from 'express';
import 'dotenv/config';
import createError from 'http-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import app from './src/config/express.js';
import handleErrors from './src/utils/errorhandler.js';
import configureSwagger from './src/config/swagger.config.js';
import passport from './src/passport/passport-config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import routes from './src/config/routes.js';

const port = 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
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

// configureSwagger(app)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  handleErrors(err, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
