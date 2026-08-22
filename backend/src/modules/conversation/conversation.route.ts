import { Router } from "express";
import {
  getConversationsController,
  getConversationByIdController,
  updateConversationStatusController,
  sendMessageToConversationController,
  deleteConversationController,
} from "./conversation.controller";
import authGuard from "../../middleware/auth.middleware";

const router = Router();

router.use(authGuard);

router.get("/", getConversationsController);
router.post("/:conversationId/messages", sendMessageToConversationController);
router.patch("/:conversationId/status", updateConversationStatusController);
router.delete("/:conversationId", deleteConversationController);
router.get("/:conversationId", getConversationByIdController);

export const conversationRoutes = router;
