import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import createError from 'http-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import app from './src/config/express.ts';
import handleErrors from './src/utils/errorhandler.ts';
import passport from './src/passport/passport-config.ts';
import session from 'express-session';

import routes from './src/config/routes.ts';
import { connectToMongoDB } from './src/config/db.ts';
import { CustomErrorType } from './src/utils/errorhandler.ts';

const port = 4000;
const __filename = path.resolve(import.meta.url);
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
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use(
  (err: CustomErrorType, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    handleErrors(err, res);
  }
);

connectToMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
