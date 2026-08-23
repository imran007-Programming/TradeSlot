import { Request, Response, NextFunction } from "express";
import { BookingService } from "./booking.service";
import { sendResponse } from "../../utils/response";
import { AppError } from "../../utils/Apperror";

export const getAvailableSlotsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { traderId, date, durationMinutes } = req.query;

    if (!traderId || !date) {
      throw new AppError(400, "traderId and date are required");
    }

    const slots = await BookingService.getAvailableSlots(
      traderId as string,
      new Date(date as string),
      parseInt(durationMinutes as string) || 60
    );

    return sendResponse(res, {
      success: true,
      message: "Available slots retrieved successfully",
      statusCode: 200,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

export const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      customerId,
      traderId,
      slotStart,
      slotEnd,
      bookingFee,
      conversationId,
    } = req.body;

    if (!customerId || !traderId || !slotStart || !slotEnd || !bookingFee) {
      throw new AppError(400, "Missing required fields");
    }

    const booking = await BookingService.createBooking({
      customerId,
      traderId,
      slotStart,
      slotEnd,
      bufferMinutes: 30,
      bookingFee: parseFloat(bookingFee),
      conversationId,
    });

    return sendResponse(res, {
      success: true,
      message: "Booking created successfully",
      statusCode: 201,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const bookings = await BookingService.getBookings(userId);

    return sendResponse(res, {
      success: true,
      message: "Bookings retrieved successfully",
      statusCode: 200,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = Array.isArray(req.params.bookingId)
      ? req.params.bookingId[0]
      : req.params.bookingId;
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const booking = await BookingService.getBookingById(bookingId, userId);

    return sendResponse(res, {
      success: true,
      message: "Booking retrieved successfully",
      statusCode: 200,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = Array.isArray(req.params.bookingId)
      ? req.params.bookingId[0]
      : req.params.bookingId;
    const { status } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    if (!status) {
      throw new AppError(400, "Status is required");
    }

    const booking = await BookingService.updateBookingStatus(
      bookingId,
      status,
      userId
    );

    return sendResponse(res, {
      success: true,
      message: "Booking status updated successfully",
      statusCode: 200,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = Array.isArray(req.params.bookingId)
      ? req.params.bookingId[0]
      : req.params.bookingId;
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    const booking = await BookingService.cancelBooking(bookingId, userId);

    return sendResponse(res, {
      success: true,
      message: "Booking cancelled successfully",
      statusCode: 200,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = Array.isArray(req.params.bookingId) ? req.params.bookingId[0] : req.params.bookingId;
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(401, "User not authenticated");

    await BookingService.deleteBooking(bookingId, userId);

    return sendResponse(res, {
      success: true,
      message: "Booking deleted successfully",
      statusCode: 200,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const createBookingFromConversationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId, slotStart, slotEnd, bookingFee } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
    }

    if (!conversationId || !slotStart || !slotEnd || !bookingFee) {
      throw new AppError(400, "Missing required fields");
    }

    const booking = await BookingService.createBookingFromConversation(
      conversationId,
      slotStart,
      slotEnd,
      parseFloat(bookingFee),
      userId
    );

    return sendResponse(res, {
      success: true,
      message: "Booking created from conversation successfully",
      statusCode: 201,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
