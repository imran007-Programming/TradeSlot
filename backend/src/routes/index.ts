import { Router } from "express"
import { authRouter } from "../modules/auth/auth.routes";
import { workAreaRoute } from "../modules/workArea/workArea.routes";

const router = Router();

const routes = [
    {
        path: "/auth",
        router: authRouter
    },
    {
        path: "/work-area",
        router: workAreaRoute
    }
]

routes.forEach((route) => {
    router.use(route.path, route.router)
})

export default router;