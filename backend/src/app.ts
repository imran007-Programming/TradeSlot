import express from 'express';
import cors from "cors"
import helmet from 'helmet';
// @ts-ignore
import cookieParser from 'cookie-parser';
import router from './routes';
import { globalErrorHandler } from './middleware/globalErrorHandler';

const app = express();

// Stripe webhook needs raw body for signature verification — must be BEFORE express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Middleware order matters!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// CORS must be before routes
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api', router);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TradeSlot API is running',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

export default app;

