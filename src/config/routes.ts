import v1Routes from '../routes/v1/index.ts';
import listEndpoints from 'express-list-endpoints';
import { displayDataInTable } from '../utils/logRoutesUtils.ts';
import { Express } from 'express';

const routes = (app: Express) => {
  v1Routes.forEach((route) => {
    app.use('/api/v1/', route);
  });

  // Log all routes
  const endpoints = listEndpoints(app);
  displayDataInTable(endpoints);
};

export default routes;
