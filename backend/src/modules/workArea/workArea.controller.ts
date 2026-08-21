import { NextFunction, Response } from 'express';
import { Request } from 'express';
import { sendResponse } from '../../utils/response';
import { AppError } from '../../utils/Apperror';
import { workAreaService } from './workArea.service';

const setWorkArea = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user?.userId;

        if (!userId) {
            throw new AppError(401, "User not authenticated");
        }

        const data = req.body;
        const workarea = await workAreaService.setWorkArea(userId, data)

        return sendResponse(res, {
            message: "work area set successfully",
            success: true,
            statusCode: 201,
            data: workarea,
        })
    } catch (error) {
        next(error)
    }
}

const getWorkAreas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user?.userId;

        if (!userId) {
            throw new AppError(401, "User not authenticated");
        }

        const workAreas = await workAreaService.getWorkAreas(userId)

        return sendResponse(res, {
            message: "work areas retrieved successfully",
            success: true,
            statusCode: 200,
            data: workAreas,
        })
    } catch (error) {
        next(error)
    }
}

const updateWorkArea = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user?.userId;
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!userId) {
            throw new AppError(401, "User not authenticated");
        }

        const data = req.body;
        const workArea = await workAreaService.updateWorkArea(userId, id, data)

        return sendResponse(res, {
            message: "work area updated successfully",
            success: true,
            statusCode: 200,
            data: workArea,
        })
    } catch (error) {
        next(error)
    }
}

const deleteWorkArea = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user?.userId;
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!userId) {
            throw new AppError(401, "User not authenticated");
        }

        const result = await workAreaService.deleteWorkArea(userId, id)

        return sendResponse(res, {
            message: "work area deleted successfully",
            success: true,
            statusCode: 200,
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

export default {
    setWorkArea,
    getWorkAreas,
    updateWorkArea,
    deleteWorkArea
}