import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/response";
import { AppError } from "../../utils/Apperror";

export const verifySessionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.query.session_id as string;
        if (!sessionId) throw new AppError(400, "session_id is required");

        const result = await PaymentService.verifyAndConfirmSession(sessionId);

        return sendResponse(res, {
            success: true,
            message: result.paid ? "Payment confirmed" : "Payment not completed",
            statusCode: 200,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const createCheckoutSessionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bookingId = Array.isArray(req.params.bookingId) ? req.params.bookingId[0] : req.params.bookingId;
        const userId = (req as any).user?.userId;

        if (!userId) throw new AppError(401, "User not authenticated");
        if (!bookingId) throw new AppError(400, "Booking ID is required");

        const result = await PaymentService.createCheckoutSession(bookingId, userId);

        return sendResponse(res, {
            success: true,
            message: "Checkout session created successfully",
            statusCode: 200,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const bookingId = Array.isArray(req.params.bookingId) ? req.params.bookingId[0] : req.params.bookingId;
        const userId = (req as any).user?.userId;

        if (!userId) throw new AppError(401, "User not authenticated");
        if (!bookingId) throw new AppError(400, "Booking ID is required");

        const payment = await PaymentService.getPaymentByBookingId(bookingId, userId);

        return sendResponse(res, {
            success: true,
            message: payment ? "Payment retrieved" : "No payment found for this booking",
            statusCode: 200,
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentSummaryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) throw new AppError(401, "User not authenticated");

        const summary = await PaymentService.getPaymentSummary(userId);

        return sendResponse(res, {
            success: true,
            message: "Payment summary retrieved",
            statusCode: 200,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};
