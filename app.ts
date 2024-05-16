import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import createError from 'http-errors';
import app, { httpServer } from './src/config/express.ts';
import handleErrors from './src/utils/errorhandler.ts';

import { connectToMongoDB } from './src/config/db.ts';
import { CustomErrorType } from './src/utils/errorhandler.ts';

const port = 4000;

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
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
