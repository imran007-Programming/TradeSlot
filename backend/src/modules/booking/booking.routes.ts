import { Router } from "express";
import {
  getAvailableSlotsController,
  createBookingController,
  createBookingFromConversationController,
  getBookingsController,
  getBookingByIdController,
  updateBookingStatusController,
  cancelBookingController,
  deleteBookingController,
} from "./booking.controller";
import authGuard from "../../middleware/auth.middleware";

const router = Router();

router.get("/slots/available", getAvailableSlotsController);
router.post("/", createBookingController);
router.post("/from-conversation", authGuard, createBookingFromConversationController);
router.get("/", authGuard, getBookingsController);
router.get("/:bookingId", authGuard, getBookingByIdController);
router.patch("/:bookingId/status", authGuard, updateBookingStatusController);
router.post("/:bookingId/cancel", authGuard, cancelBookingController);
router.delete("/:bookingId", authGuard, deleteBookingController);

export const bookingRouter = router;
