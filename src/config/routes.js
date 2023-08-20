
import v1Routes from '../routes/v1/index.js';
import listEndpoints from 'express-list-endpoints';
import { displayDataInTable } from '../utils/logRoutesUtils.js';

const routes =  (app) => {

  v1Routes.forEach((route) => {
    app.use('/api/v1/', route);
  })
  
  // Log all routes
  const endpoints = listEndpoints(app);
  displayDataInTable(endpoints)
};



export default routes