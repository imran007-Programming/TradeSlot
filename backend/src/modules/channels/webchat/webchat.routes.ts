import { Router } from "express";
import { receiveWebChatMessage } from "./webchat.controller";

const router = Router();

router.post("/message", receiveWebChatMessage);

export const webchatRoutes = router;
