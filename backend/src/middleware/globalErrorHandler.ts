import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/Apperror';

export const globalErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            statusCode: error.statusCode
        })
    }

    // Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error as any;
        if (prismaError.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: `${prismaError.meta?.target?.[0] || 'Field'} already exists`,
                statusCode: 400
            })
        }
        if (prismaError.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Record not found',
                statusCode: 404
            })
        }
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            statusCode: 401
        })
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            statusCode: 401
        })
    }

    // Default error
    res.status(500).json({
        success: false,
        message: error.message || "internal server error",
        statusCode: 500
    })
}