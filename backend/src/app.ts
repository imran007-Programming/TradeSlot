import express from 'express';
import cors from "cors"
import helmet from 'helmet';
const app = express();
app.use(express.json());
app.use(helmet())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}))

export default app;
