import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import cookieParse from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParse());
app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: 'Too many requests, please try again later!' },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: ipKeyGenerator,
});

app.use(limiter);

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use('/', proxy('http://localhost:6001'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);
