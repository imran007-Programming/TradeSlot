import { Request, Response, NextFunction } from "express";

import { Channel } from "@prisma/client";

import * as messageService from "./message.service";

import { sendResponse } from "../../utils/response";
import { AppError } from "../../utils/Apperror";

export const receiveMessage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { phone, name, traderId, channel, content } = req.body;

        if (!phone) {
            throw new AppError(400, "Phone is required");
        }

        if (!traderId) {
            throw new AppError(400, "Trader ID is required");
        }

        if (!channel) {
            throw new AppError(400, "Channel is required");
        }

        if (!content) {
            throw new AppError(400, "Message content is required");
        }

        if (!Object.values(Channel).includes(channel)) {
            throw new AppError(400, "Invalid channel");
        }

        const result = await messageService.receiveMessage({
            phone,
            name,
            traderId,
            channel,
            content,
        });

        return sendResponse(res, {
            success: true,
            message: "Message received successfully",
            statusCode: 201,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
