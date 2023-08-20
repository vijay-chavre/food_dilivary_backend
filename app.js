import express from 'express';
import 'dotenv/config'
import createError from 'http-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import app from './src/config/express.js';
import routes from './src/config/routes.js';

const port = 4000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

routes(app);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;