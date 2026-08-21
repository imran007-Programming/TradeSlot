import { Request, Response, NextFunction } from "express";
import { handleWhatsAppMessage } from "./whatsapp.service";
import { sendResponse } from "../../../utils/response";
import { AppError } from "../../../utils/Apperror";

export const receiveWhatsAppMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, text, timestamp, name, traderId } = req.body;

    const result = await handleWhatsAppMessage({
      from,
      text,
      timestamp,
      name,
      traderId,
    });

    return sendResponse(res, {
      success: true,
      message: "WhatsApp message received successfully",
      statusCode: 201,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
