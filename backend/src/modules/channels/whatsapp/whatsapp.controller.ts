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
    // Twilio sends data in form-encoded format
    const { From, Body, ProfileName } = req.body;

    if (!From || !Body) {
      throw new AppError(400, "Missing required fields: From, Body");
    }

    // Extract phone number from Twilio format (whatsapp:+1234567890)
    const phoneNumber = From.replace("whatsapp:", "");
    const traderId = process.env.TRADER_ID; // For Twilio, trader ID from env or request

    if (!traderId) {
      throw new AppError(400, "Trader ID is required");
    }

    const result = await handleWhatsAppMessage({
      from: phoneNumber,
      text: Body,
      name: ProfileName,
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
