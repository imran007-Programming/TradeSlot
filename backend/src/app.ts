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
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
}));

app.use('/api', router);

app.get('/health', (req, res) => {
    res.send('api is running')
});

app.use(globalErrorHandler);

export default app;

