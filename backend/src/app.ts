import express from 'express';
import cors from "cors"
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './routes';
import { globalErrorHandler } from './middleware/globalErrorHandler';

const app = express();
app.use(express.json());
app.use(helmet())
app.use(cookieParser())

app.use('/api', router)

app.get('/health', (req, res) => {
    res.send('api is running')
})
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}))

app.use(globalErrorHandler)

export default app;
