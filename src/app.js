import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import apiRouter from './routes/index.js';
import { config } from './config/config.js';
import { connectDatabase } from './config/database.js';
import { initializePassport } from './config/passport.config.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

initializePassport();
app.use(passport.initialize());

app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(config.port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar la aplicación:', error.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
