import { Router } from "express";
import { receiveWebChatMessage, getWebChatMessagesController, confirmWebChatBookingController } from "./webchat.controller";

const router = Router();

router.post("/message", receiveWebChatMessage);
router.get("/messages", getWebChatMessagesController);
router.post("/confirm-booking", confirmWebChatBookingController);

export const webchatRoutes = router;
