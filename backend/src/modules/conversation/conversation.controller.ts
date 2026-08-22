import { Request, Response, NextFunction } from "express";
import * as conversationService from "./conversation.service";
import { sendResponse } from "../../utils/response";
import { AppError } from "../../utils/Apperror";

export const getConversationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const conversations = await conversationService.getConversations(userId);

    return sendResponse(res, {
      success: true,
      message: "Conversations retrieved successfully",
      statusCode: 200,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const conversation = await conversationService.getConversationById(
      conversationId,
      userId,
    );

    return sendResponse(res, {
      success: true,
      message: "Conversation retrieved successfully",
      statusCode: 200,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConversationStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;
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
      userId,
    );

    return sendResponse(res, {
      success: true,
      message: "Conversation status updated successfully",
      statusCode: 200,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessageToConversationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;
    const { content } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    if (!content || !content.trim()) {
      throw new AppError(400, "Message content is required");
    }

    const message = await conversationService.sendMessageToConversation(
      conversationId,
      content.trim(),
      userId
    );

    return sendResponse(res, {
      success: true,
      message: "Message sent successfully",
      statusCode: 201,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
