import { Request, Response, NextFunction } from "express";
import { handleWebChatMessage } from "./webchat.service";
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
