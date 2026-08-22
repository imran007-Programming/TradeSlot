import { Request, Response, NextFunction } from "express";
import { handleWebChatMessage, getWebChatMessages } from "./webchat.service";
import { sendResponse } from "../../../utils/response";
import { AppError } from "../../../utils/Apperror";

export const receiveWebChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, text, name, traderId } = req.body;

    const result = await handleWebChatMessage({
      phone,
      text,
      name,
      traderId,
    });

    return sendResponse(res, {
      success: true,
      message: "Web chat message received successfully",
      statusCode: 201,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getWebChatMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, traderId } = req.query;

    if (!phone) {
      throw new AppError(400, "Phone is required");
    }

    const messages = await getWebChatMessages(
      phone as string,
      traderId as string | undefined
    );

    return sendResponse(res, {
      success: true,
      message: "Messages retrieved successfully",
      statusCode: 200,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
