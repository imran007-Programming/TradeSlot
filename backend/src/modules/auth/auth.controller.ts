
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/response";
import { AppError } from "../../utils/Apperror";
import { authService } from "./auth.service";
import { generateToken, verifyRefreshToken } from "../../utils/generateToken";


const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await authService.register(req.body)
        return sendResponse(res, {
            data,
            message: 'user registered',
            success: true,
            statusCode: 201
        }
        )
    } catch (error) {
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await authService.login(req.body)
        
        if (!data.token) {
            throw new AppError(500, "Token generation failed");
        }

        res.cookie("accessToken", data.token.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.cookie("refreshToken", data.token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        })

        return sendResponse(res, {
            data,
            message: 'user logged in',
            success: true,
            statusCode: 200
        }
        )
    } catch (error) {
        next(error)
    }
}

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user?.userId

        if (!userId) {
            throw new AppError(401, "User not authenticated")
        }

        const data = await authService.getMe(userId)

        return sendResponse(res, {
            data,
            message: 'user retrieved',
            success: true,
            statusCode: 200
        }
        )
    } catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        const data = await authService.logout()

        return sendResponse(res, {
            data,
            message: 'user logged out',
            success: true,
            statusCode: 200
        }
        )
    } catch (error) {
        next(error)
    }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            throw new AppError(401, 'Refresh token not found');
        }

        const decoded = verifyRefreshToken(token) as any;

        const newTokens = generateToken({
            userId: decoded.userId,
            role: decoded.role
        });

        res.cookie("accessToken", newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return sendResponse(res, {
            data: { accessToken: newTokens.accessToken },
            message: 'Token refreshed successfully',
            success: true,
            statusCode: 200
        });
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError(401, 'Refresh token expired, please login again'));
        }
        next(new AppError(401, 'Invalid refresh token'));
    }
}

export default {
    register,
    login,
    getMe,
    logout,
    refreshToken
}