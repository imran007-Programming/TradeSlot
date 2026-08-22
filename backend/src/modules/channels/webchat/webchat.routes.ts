import { Router } from "express";
import { receiveWebChatMessage, getWebChatMessagesController } from "./webchat.controller";

const router = Router();

router.post("/message", receiveWebChatMessage);
router.get("/messages", getWebChatMessagesController);

export const webchatRoutes = router;
