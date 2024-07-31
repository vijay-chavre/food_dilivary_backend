import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import createError from 'http-errors';
import app, { httpServer } from './src/config/express';
import handleErrors from './src/utils/errorhandler';

import { connectToMongoDB } from './src/config/db';
import { CustomErrorType } from './src/utils/errorhandler';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yaml';
import fs from 'fs';
const file = fs.readFileSync(path.resolve(__dirname, './swagger.json'), 'utf8');
const swaggerDocument = YAML.parse(file);

const port = 4000;
app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: 'none', // keep all the sections collapsed by default
    },
    customSiteTitle: 'FreeAPI docs',
  })
);
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
