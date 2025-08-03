import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, responseFormatter } from '@estore/middlewares';
import router from './routes/auth.router';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = require('./swagger-output.json');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(responseFormatter)

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs.json', (req, res) => {
  res.json(swaggerDocument);
});
app.use('/auth', router);

app.use(errorHandler);

const port = process.env.PORT || 6001;

const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/auth`);
});

server.on('error', console.error);
