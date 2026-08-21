import { Router, Request, Response, NextFunction } from "express";
import * as conversationService from "./conversation.service";
import { AppError } from "../../utils/Apperror";
import authGuard from "../../middleware/auth.middleware";

const router = Router();

router.use(authGuard);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const conversations = await conversationService.getConversations(userId);

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:conversationId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const conversation = await conversationService.getConversationById(
      conversationId,
      userId
    );

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:conversationId/status",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const { status } = req.body;
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError(401, "User not authenticated");
      }

      if (!status) {
        throw new AppError(400, "Status is required");
      }

      const conversation = await conversationService.updateConversationStatus(
        conversationId,
        status,
        userId
      );

      res.json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const conversationRoutes = router;
