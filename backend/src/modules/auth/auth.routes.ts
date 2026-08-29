import { Router } from "express"
import authController from "./auth.controller"
import authGuard from "../../middleware/auth.middleware"


const router = Router()

// public routes
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/refresh-token", authController.refreshToken)

// protected routes
router.get("/me", authGuard, authController.getMe)
router.post("/logout", authGuard, authController.logout)

export const authRouter = router