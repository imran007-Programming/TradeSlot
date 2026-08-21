import { Router } from "express";
import { receiveMessage } from "./message.controller";

const router = Router();

router.post("/receive", receiveMessage);

export const messageRoutes = router;
