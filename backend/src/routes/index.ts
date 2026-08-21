import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { workAreaRoute } from "../modules/workArea/workArea.routes";
import { messageRoutes } from "../modules/message/message.route";
import { conversationRoutes } from "../modules/conversation/conversation.route";
import { whatsappRoutes } from "../modules/channels/whatsapp/whatsapp.routes";
import { webchatRoutes } from "../modules/channels/webchat/webchat.routes";

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
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
