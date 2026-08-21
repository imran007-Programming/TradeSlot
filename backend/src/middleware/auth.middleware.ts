import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../utils/response';
import { AppError } from '../utils/Apperror';
import { verifyToken } from '../utils/generateToken';
import { Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

const authGuard = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;


    if (!token) {
        return next(new AppError(401, 'Authentication Required'))
    }
    try {
        const decode = verifyToken(token) as any
        req.user = {
            userId: decode.userId,
            role: decode.role
        }
        next()
    } catch (error) {
        next(new AppError(401, 'Invalid token'))
    }
}

export default authGuard