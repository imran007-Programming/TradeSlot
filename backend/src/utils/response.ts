import { Response } from 'express';

interface IResponse {
    success: boolean,
    statusCode: number,
    message: string,
    data: any | null
}

export const sendResponse = (res: Response, { success, message, statusCode, data }: IResponse) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    })
}