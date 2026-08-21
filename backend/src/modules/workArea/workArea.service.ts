import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/Apperror";
import { IworkArea } from "./workArea.type"


const setWorkArea = async (userId: string, data: IworkArea) => {
    const { availableDate, area } = data;
    // find the trader

    const trader = await prisma.trader.findUnique({
        where: {
            userId
        }
    })
    if (!trader) throw new AppError(404, "trader not found")
    // validate date

    const date = new Date(availableDate)

    if (isNaN(date.getTime())) {
        throw new AppError(400, "Invalid date");
    }
    // check if the trader has already workarea for that date

    const existingWorkArea = await prisma.workArea.findUnique({
        where: {
            traderId_availableDate: {
                traderId: trader.id,
                availableDate: date
            }
        }
    })

    if (existingWorkArea) {
        throw new AppError(400, "Work area already exists for this date")
    }

    const workArea = await prisma.workArea.create({
        data: {
            traderId: trader.id,
            availableDate: date,
            area
        }
    })

    return workArea
}

const getWorkAreas = async (userId: string) => {
    const trader = await prisma.trader.findUnique({
        where: { userId }
    })
    if (!trader) throw new AppError(404, "Trader not found")

    const workAreas = await prisma.workArea.findMany({
        where: {
            traderId: trader.id
        },
        orderBy: {
            availableDate: 'desc'
        }
    })

    return workAreas
}

const updateWorkArea = async (userId: string, workAreaId: string, data: IworkArea) => {
    const { availableDate, area } = data;
    
    const trader = await prisma.trader.findUnique({
        where: { userId }
    })
    if (!trader) throw new AppError(404, "Trader not found")

    const workArea = await prisma.workArea.findUnique({
        where: { id: workAreaId }
    })
    if (!workArea) throw new AppError(404, "Work area not found")
    if (workArea.traderId !== trader.id) throw new AppError(403, "Unauthorized")

    const date = new Date(availableDate)
    if (isNaN(date.getTime())) {
        throw new AppError(400, "Invalid date");
    }

    const updated = await prisma.workArea.update({
        where: { id: workAreaId },
        data: {
            availableDate: date,
            area
        }
    })

    return updated
}

const deleteWorkArea = async (userId: string, workAreaId: string) => {
    const trader = await prisma.trader.findUnique({
        where: { userId }
    })
    if (!trader) throw new AppError(404, "Trader not found")

    const workArea = await prisma.workArea.findUnique({
        where: { id: workAreaId }
    })
    if (!workArea) throw new AppError(404, "Work area not found")
    if (workArea.traderId !== trader.id) throw new AppError(403, "Unauthorized")

    await prisma.workArea.delete({
        where: { id: workAreaId }
    })

    return { message: "Work area deleted successfully" }
}









export const workAreaService = {
    setWorkArea,
    getWorkAreas,
    updateWorkArea,
    deleteWorkArea
}