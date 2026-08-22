import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { workAreaRoute } from "../modules/workArea/workArea.routes";
import { bookingRouter } from "../modules/booking/booking.routes";
import { messageRoutes } from "../modules/message/message.route";
import { conversationRoutes } from "../modules/conversation/conversation.route";
import { whatsappRoutes } from "../modules/channels/whatsapp/whatsapp.routes";
import { webchatRoutes } from "../modules/channels/webchat/webchat.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { webhookRoutes } from "../modules/payment/webhook.routes";
import { traderRoutes } from "../modules/trader/trader.routes";

const router = Router();

const routes = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/work-area",
    router: workAreaRoute,
  },
  {
    path: "/bookings",
    router: bookingRouter,
  },
  {
    path: "/messages",
    router: messageRoutes,
  },
  {
    path: "/conversations",
    router: conversationRoutes,
  },
  {
    path: "/channels/whatsapp",
    router: whatsappRoutes,
  },
  {
    path: "/channels/webchat",
    router: webchatRoutes,
  },
  {
    path: "/payments",
    router: paymentRoutes,
  },
  {
    path: "/webhooks",
    router: webhookRoutes,
  },
  {
    path: "/traders",
    router: traderRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;

