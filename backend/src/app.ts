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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'https://trade-slot.vercel.app',
].filter(Boolean) as string[];

// CORS must be before routes
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or if origin is in allowedOrigins / localhost
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
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

