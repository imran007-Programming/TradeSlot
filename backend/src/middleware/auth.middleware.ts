import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/Apperror';
import { verifyToken } from '../utils/generateToken';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

const authGuard = (req: Request, res: Response, next: NextFunction) => {
    // Check cookie or Bearer token header for cross-origin / local compatibility!
    const authHeader = req.headers.authorization;
    const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (!token) {
        return next(new AppError(401, 'Authentication Required'));
    }
    try {
        const decode = verifyToken(token) as any;
        req.user = {
            userId: decode.userId,
            role: decode.role
        };
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError(401, 'Token expired'));
        }
        return next(new AppError(401, 'Invalid token'));
    }
};

export default authGuard;